import { Random } from './random'
import { State } from './state'
import { Stage, Background } from './stages'
import { generatePalette } from './colors'
import { ImageBuffer } from './imagebuffer'

export class Motif {
  static render(seed: string, canvas: HTMLCanvasElement) {
    console.log("rendering motif")
    const random = new Random(seed)

    const state: State = {
      baseSeed: seed,
      horizon: Math.floor(random.triangular(canvas.height * 0.4, canvas.height * 0.8)),
      height: canvas.height,
      width: canvas.width,
      palette: generatePalette(seed),
      imageBuffer: new ImageBuffer(canvas)
    }

    const stagesToRun: Stage[] = [
      new Background()
      // stages.moon,
      // stages.mountains,
      // stages.rocks,
      // stages.water
    ]

    for (const stage of stagesToRun) {
      console.log(stage)
      stage.run(state)
    }

    state.imageBuffer.paintCanvas()
  }
}