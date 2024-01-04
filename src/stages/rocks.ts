import { Color } from "../color";
import { FG_DARK_INDEX, FG_LIGHT_INDEX, FG_MID_INDEX, WHITE_INDEX, WHITE_RGB } from "../colors";
import { ImageBuffer } from "../imagebuffer";
import { Layer } from "../layer";
import { LayerType } from "../layertype";
import { Random } from "../random";
import { Reflection } from "../reflection";
import { State } from "../state";
import { Stage } from "./stage";

export class Rocks implements Stage {
    static MAX_ROCK_HEIGHT = 10
    static TOP_DECREASE_PERCENTAGE = 0.25
    static BOTTOM_DECREASE_PERCENTAGE = 0.05

    random: Random

    run(state: State): Layer[] {
        this.random = new Random(state.baseSeed)
        const numSpits = this.random.randint(2, 5)
        const yMins: number[] = []
        for (let i = 0; i < numSpits; i++) {
            yMins.push(this.random.randint(state.horizon - 10, state.height - 10))
        }
        yMins.sort()
        yMins.reverse()
        const yMaxes = yMins.map(ym => Math.min(ym + this.random.randint(10, 30), state.height))

        const layer = new Layer(state.width, state.height, Reflection.REFLECT_BASE, LayerType.ROCKS, [])

        for (let i = 0; i < numSpits; i++) {
            this.drawSpit(layer, yMins[i], yMaxes[i], state)
        }

        return [layer]
    }

    private drawSpit(layer: Layer, yMin: number, yMax: number, state: State) {
        const spitBuffer: ImageBuffer = layer.imageBuffer
        const hasTrees = this.random.random() < 0.5
        const fromLeft = this.random.random() < 0.5

        let x = fromLeft ? 0 : state.width - 1
        let rockHeight = 3
        let rockDeltaHeight = 0

        while (yMax > yMin && x >= 0 && x < state.width) {
            for (let y = yMin - rockHeight; y < yMax; y++) {
                let colorIndex: number;
                if (spitBuffer.getPixel(x, y) != 0) {
                    continue
                } else if (y == yMax - 1 || (yMax - (yMin - rockHeight) < 2)) {
                    colorIndex = WHITE_INDEX
                } else if (y == yMin && y < yMax - rockHeight) {
                    colorIndex = FG_DARK_INDEX
                } else if (y == yMax - 2) {
                    colorIndex = FG_DARK_INDEX
                } else if (y == yMax - rockHeight) {
                    colorIndex = FG_DARK_INDEX
                } else if(y > yMax - rockHeight) {
                    const fromTop = y - (yMax - rockHeight)
                    if (fromLeft && fromTop < 4 && rockDeltaHeight > 0) {
                        colorIndex = FG_LIGHT_INDEX
                    } else if (!fromLeft && fromTop < 4 && rockDeltaHeight < 0) {
                        colorIndex = FG_LIGHT_INDEX
                    } else {
                        colorIndex = FG_MID_INDEX
                    }
                } else if (y > yMin) {
                    if (x + y % 2 == 0 || this.random.random() < 0.2) {
                        colorIndex = FG_DARK_INDEX
                    } else {
                        colorIndex = FG_MID_INDEX
                    }
                }

                if (colorIndex != undefined) {
                    layer.imageBuffer.setPixel(x, y, state.palette[colorIndex])
                }
            }

            if (this.random.random() < Rocks.TOP_DECREASE_PERCENTAGE) {
                yMin += 1
            }
            if (this.random.random() < Rocks.BOTTOM_DECREASE_PERCENTAGE && yMax > state.horizon) {
                yMax -= 1
            }

            if (rockDeltaHeight > 0 && this.random.random() < 0.8) {
                rockDeltaHeight -= 1
            } else if (rockDeltaHeight == 0 && this.random.random() < 0.4) {
                rockDeltaHeight -= 1
            } else if (rockDeltaHeight < 0 && this.random.random() < 0.3) {
                rockDeltaHeight -= 1
            }

            rockHeight += rockDeltaHeight

            if (rockHeight < 1) {
                if (yMax - yMin > 5) {
                    rockDeltaHeight = this.random.randint(2, 3)
                } else {
                    rockHeight = 0
                }
            }

            if (hasTrees && this.random.random() < 0.15 ) {
                this.placeTree(spitBuffer, x, yMin, state.width, state.height, state.palette[FG_DARK_INDEX])
            }

            x += fromLeft ? 1 : -1
        }
    }

    private placeTree(spitBuffer: ImageBuffer, x: number, yStart: number, width: number, height: number, color: Color): void {
        const treeHeight = this.random.randint(4, 10)
        const hasLeaves = this.random.random() < 0.8

        for (let i = 0; i < treeHeight; i++) {
            let y = yStart - i
            if (x >= 0 && x < width && y >= 0 && y < height) {
                spitBuffer.setPixel(x, y, color)
            }
            if (hasLeaves && i % 2 == 0 && i < treeHeight - 1) {
                for (let leafX = Math.min(-10 + i, 0); leafX < Math.max(10 - i, 0) + 3; leafX++) {
                    const xCoord = x + Math.floor(leafX / 3)
                    if (xCoord >= 0 && xCoord < width) {
                        spitBuffer.setPixel(xCoord, y, color)
                    }
                }
            }
        }
    }
}