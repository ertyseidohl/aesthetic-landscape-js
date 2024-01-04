import { Color } from '../color'
import { FG_DARK_INDEX, FG_LIGHT_INDEX, FG_MID_INDEX, WHITE_INDEX } from '../colors'
import { Layer } from '../layer'
import { LayerType } from '../layertype'
import { Random } from '../random'
import { Reflection } from '../reflection'
import { State } from '../state'
import { Stage } from './stage'

class Point {
    constructor(public x: number, public y: number) {}
}

export class Mountains implements Stage {
    run(state: State): Layer[] {
        const layer = new Layer(state.width, state.height, Reflection.REFLECT_BASE, LayerType.MOUNTAIN, [])
        const random = new Random(state.baseSeed)

        const mountainColors = [state.palette[FG_LIGHT_INDEX], state.palette[FG_MID_INDEX], state.palette[FG_DARK_INDEX]]

        const numRanges = random.randint(2, 3)
        for (let i = 0; i < numRanges; i++) {
            const numPeaks = random.randint(4, 40)
            this.drawMountainRange(state, numPeaks, mountainColors[i], layer)
        }

        return [layer]
    }

    private drawMountainRange(state: State, numPeaks: number, color: Color, layer: Layer): void {
        const random = new Random(state.baseSeed)

        const bandwidthFactor = random.triangular(0, 1)
        const yShiftFactor = random.random() - 0.5
        const mid = state.horizon / 2
        const yShift = mid * yShiftFactor
        const bandMiddle = mid + yShift

        const topHeight = Math.max(bandMiddle - (mid * bandwidthFactor), 20)
        const bottomHeight = Math.min(bandMiddle + (mid * bandwidthFactor), state.horizon * 0.9)
        const peakList: Point[] = []
        for (let i = 0; i < numPeaks; i++) {
            peakList.push(new Point(random.randint(0, state.width), random.randint(topHeight, bottomHeight)))
        }
        peakList.sort((a, b) => a.x - b.x)

        const patchColor = state.palette[WHITE_INDEX]

        peakList.map((peak) => new Mountain(state, peak, color, patchColor)).forEach(m => m.draw(layer))

    }
}

class Mountain {
    private random: Random
    private outline: Point[]
    private peak: Point
    private patches: Point[][]
    private horizon: number
    private color: Color
    private patchColor: Color

    private static SLOPES: Point[] = [
        [0, 0],
        [2, 1],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 3],
        [1, 2],
        [2, 1],
    ].map(([x, y]) => new Point(x, y))

    constructor(state: State, peak: Point, color: Color, patchColor: Color) {
        this.random = new Random(state.baseSeed)
        this.horizon = state.horizon
        this.peak = peak
        this.outline = [peak]
        this.color = color
        this.patchColor = patchColor

        this.fill()
    }

    private fill() {
        for (let refl of [1, -1]) {
            let walk = this.peak
            let slopeIndex: number = 0
            let slopeStability: number = 0
            const slopeGravity: number = this.random.choice([0.1, 0.15, 0.15, 0.2, 0.25])
            while (walk.y < this.horizon) {
                [slopeIndex, slopeStability] = this.slopeStep(slopeIndex, slopeStability, slopeGravity)
                walk = new Point(
                    walk.x + (refl * Mountain.SLOPES[slopeIndex].x),
                    Math.min(walk.y + Mountain.SLOPES[slopeIndex].y, this.horizon)
                )
                this.outline.push(walk)
            }
        }
        return this.outline.sort((a, b) => a.x - b.x)
    }

    private slopeStep(slopeIndex: number, slopeStability: number, slopeGravity: number): [number, number] {
        if(slopeStability + this.random.random() > 1) {
            slopeIndex = slopeIndex + this.random.choice([1, 1, 1, -1, -1, 2, -2])
            slopeStability = 0
        } else {
            slopeStability += slopeGravity
        }

        // this is new - wrap instead of clamp
        slopeIndex = slopeIndex % Mountain.SLOPES.length
        if (slopeIndex < 0) {
            slopeIndex = Mountain.SLOPES.length + slopeIndex
        }

        return [slopeIndex, slopeStability]
    }

    public draw(layer: Layer) {
        for (let i = 0; i < this.outline.length - 1; i++) {
            let currPoint = this.outline[i]
            let nextPoint = this.outline[i+1]
            let xDiff = nextPoint.x - currPoint.x
            for (let xRun = 0; xRun < xDiff; xRun++) {
                let x = currPoint.x + xRun
                // Attempt to lerp between each outline point. May not be correct.
                let topY = Math.floor(currPoint.y + ((nextPoint.y - currPoint.y) / xDiff))
                for (let y = topY; y < this.horizon; y++) {
                    layer.imageBuffer.setPixel(x, y, this.color)
                }
            }
        }

        const patchCount = this.random.randint(1, 4)
        this.drawPatch(layer, this.patchColor, 0)
        for(let i = 0; i < patchCount; i++) {
            this.drawPatch(layer, this.patchColor, this.random.random())
        }
    }

    private drawPatch(layer: Layer, color: Color, weight: number) {
        let startPixel: Point
        if (weight == 0) {
            startPixel = this.peak
        } else {
            let startY = this.peak.y
            startY = startY + (this.horizon - startY) * this.random.triangular(0, 1) * weight
            startY = Math.ceil(startY)

            let startX = this.peak.x
            while(this.pixelInside(startX, startY)) {
                startX -= 1
            }

            // Ensure patterns are aligned
            if (startX % 2 != this.peak.x % 2) {
                startX += 1
            }
            if (startY % 2 != this.peak.y % 2) {
                startY += 1
            }
            startPixel = new Point(startX, startY)
        }

        const width = this.random.randint(4, 10)
        let topOffset = 0
        let bottomOffset = this.random.randint(6 + Math.ceil(12 * weight), 10 + Math.ceil(12 * weight))
        for (let i = 0; i < width; i ++) {
            topOffset += this.random.choice([2, 1, 1, 0, -1, -1, -2])
            bottomOffset += this.random.choice([2, 1, 1, 0, -1, -1, -2])
            for (let j = topOffset; j < bottomOffset; j++) {
                const x = startPixel.x + i - j
                const y = startPixel.y + i + j

                if (this.pixelInside(x, y)) {
                    layer.imageBuffer.setPixel(x, y, color)
                }
            }
        }
    }

    private pixelInside(x: number, y: number): boolean {
        let dx = 10000
        let best = null
        for (let point of this.outline) {
            let deltax = Math.abs(point.x - x)
            if (deltax < dx) {
                best = point
                dx = deltax
            }
        }
        return best.y < y && y< this.horizon
    }
}