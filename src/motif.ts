import { Random } from './random'
import { State } from './state'
import { Stage, Background, Moon, Water, Mountains, Rocks } from './stages'
import { generatePalette } from './colors'
import { Layer } from './layer'

export class Motif {
  static render(seed: string, canvas: HTMLCanvasElement) {
    console.log(`Seed: ${seed}`)
    const random = new Random(seed)
    const ctx = canvas.getContext("2d")
    canvas.style.imageRendering = "pixelated"
    ctx.imageSmoothingEnabled= false

    const state: State = {
      baseSeed: seed,
      horizon: Math.floor(random.triangular(canvas.height / 4 * 0.4, canvas.height / 4 * 0.8)),
      height: canvas.height / 4,
      width: canvas.width / 4,
      palette: generatePalette(seed),
      layers: []
    }

    const stagesToRun: Stage[] = [
      new Background(),
      new Moon(),
      new Mountains(),
      new Rocks(),
      new Water()
    ]

    for (const stage of stagesToRun) {
      state.layers = state.layers.concat(stage.run(state))
    }

    const bufferCanvas = new OffscreenCanvas(state.width, state.height)
    const bufferContext = bufferCanvas.getContext("2d")
    for(const layer of state.layers) {
      bufferContext.putImageData(layer.getImageData(), 0, 0)
      ctx.drawImage(bufferCanvas, 0, 0, state.width, state.height, 0, 0, canvas.width, canvas.height)
    }
  }
}