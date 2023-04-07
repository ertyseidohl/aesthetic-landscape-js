import { Random } from './random'
import { State } from './state'
import { Stage, Background, Moon } from './stages'
import { generatePalette } from './colors'
import { Layer } from './layer'

export class Motif {
  static render(seed: string, canvas: HTMLCanvasElement) {
    const random = new Random(seed)
    const ctx = canvas.getContext("2d")

    const state: State = {
      baseSeed: seed,
      horizon: Math.floor(random.triangular(canvas.height * 0.4, canvas.height * 0.8)),
      height: canvas.height,
      width: canvas.width,
      palette: generatePalette(seed),
    }

    const stagesToRun: Stage[] = [
      new Background(),
      new Moon()
      // stages.mountains,
      // stages.rocks,
      // stages.water
    ]

    let layers: Layer[] = []
    for (const stage of stagesToRun) {
      layers = layers.concat(stage.run(state))
    }

    for(const layer of layers) {
      layer.paintCanvas(ctx)
    }
  
  }
}