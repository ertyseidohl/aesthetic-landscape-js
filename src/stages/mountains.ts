import { Color } from '../color'
import { FG_DARK_INDEX, FG_LIGHT_INDEX, FG_MID_INDEX } from '../colors'
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

        peakList.map((peak) => new Mountain(state, peak,color)).forEach(m => m.draw(layer))

    }
}

class Mountain {
    private random: Random
    private outline: Point[]
    private peak: Point
    private patches: Point[][]
    private horizon: number
    private color: Color

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

    constructor(state: State, peak: Point, color: Color) {
        this.random = new Random(state.baseSeed)
        this.horizon = state.horizon
        this.peak = peak
        this.patches = []
        this.outline = [peak]
        this.color = color
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
    }
}


// class Mountain:

//     def __init__(self, peak, horizon, fill):
//         self.outline = []
//         self.peak = peak
//         self.horizon = horizon
//         self.patches = []
//         self.fill = fill
//         _walk(self)

//     def draw(self, draw):
//         draw.polygon(self.outline, fill=self.fill)
//         for patch in self.patches:
//             for pixel in patch:
//                 draw.point(pixel, fill=colors.WHITE)

//     def outline_tail(self):
//         return self.outline[len(self.outline) -1]

//     def height(self):
//         return max(self.outline[0][1] - self.peak[1], self.outline_tail()[1])

//     def pixel_in_boundaries(self, x, y, exclusive=False):

//         dx = 10000
//         best = None
//         for point in self.outline:
//             deltax = abs(point[0] - x)
//             if deltax < dx:
//                 best = point
//                 dx = deltax

//         if exclusive:
//             return best[1] < y < self.horizon
//         return best[1] <= y <= self.horizon

//     def add_patch(self, weight=None):

//         if weight is None:
//             start_pixel = self.peak
//             weight = 0
//         else:
//             start_y = self.peak[1]
//             start_y = start_y + (self.horizon - start_y) * random.triangular() * weight
//             start_y = math.ceil(start_y)

//             start_x = self.peak[0]
//             while self.pixel_in_boundaries(start_x, start_y, exclusive=True):
//                 start_x = start_x - 1

//             if start_x % 2 != self.peak[0] % 2:
//                 start_x += 1
//             if start_y % 2 != self.peak[1] % 2:
//                 start_y += 1
//             start_pixel = (start_x, start_y)

//         width = random.randint(4, 10)
//         patch = []

//         top_offset = 0
//         bottom_offset = random.randint(6 + math.ceil(12 * weight), 10 + math.ceil(12 * weight))
//         for i in range(width):

//             top_offset = top_offset + random.choice([2, 1, 1, 0, -1, -1, -2])
//             bottom_offset = bottom_offset + random.choice([2, 1, 1, 0, -1, -1, -2])

//             for j in range(top_offset, bottom_offset):
//                 x = start_pixel[0] + i - j
//                 y = start_pixel[1] + i + j

//                 if self.pixel_in_boundaries(x, y, exclusive=True):
//                     patch.append((x,y))

//         self.patches.append(patch)



