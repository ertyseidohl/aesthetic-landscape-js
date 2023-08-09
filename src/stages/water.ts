import { Stage } from './stage'
import { State } from '../state'
import { Layer } from '../layer'
import { BG_LIGHT_INDEX, BG_LIGHTER_INDEX, WHITE_INDEX } from '../colors'
import { REFLECT_BASE, REFLECT_HORIZON, MASK } from '../reflection'

export class Water implements Stage {
  private waterColor: Color
  private waterReflColor: Color
  private moonReflColor: Color

  public run(state: State): Layer[] {
    this.waterColor = state.palette[BG_LIGHT_INDEX]
    this.waterReflColor = state.palette[BG_LIGHTER_INDEX]
    this.moonReflColor = state.palette[WHITE_INDEX]

    const mask = getWaterMask(state.layers, state.width, state.height)

  }

  private getWaterMask(layers: Layer[], width: number, height: number) {
    const mask = new ArrayBuffer(width * height)
    for (let layer of layers) {
      if ([REFLECT_BASE, REFLECT_HORIZON, MASK].includes(layer.reflection)) {
        origData = layer.getImageData()
      }
    }


  }
}