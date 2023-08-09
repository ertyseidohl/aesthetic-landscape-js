import { Stage } from './stage'
import { State } from '../state'
import { Layer } from '../layer'
import { Color } from '../color'
import { BG_LIGHT_INDEX, BG_LIGHTER_INDEX, WHITE_INDEX, TRANSPARENT_INDEX } from '../colors'
import { Reflection } from '../reflection'

export class Water implements Stage {
  private waterColor: Color
  private waterReflColor: Color
  private moonReflColor: Color

  public run(state: State): Layer[] {
    this.waterColor = state.palette[BG_LIGHT_INDEX]
    this.waterReflColor = state.palette[BG_LIGHTER_INDEX]
    this.moonReflColor = state.palette[WHITE_INDEX]

    const mask = this.getWaterMask(state.layers, state.width, state.height)

    const layer = new Layer(state.width, state.height, Reflection.NONE)

    return [layer]
  }

  private getWaterMask(layers: Layer[], width: number, height: number): ArrayBuffer {
    const maskArray = new ArrayBuffer(width * height)
    const mask = new Int8Array(maskArray)

    for (let i = 0; i < mask.length; i += 1) {
      mask[i] = 1
    }

    for (const layer of layers) {
      if ([Reflection.REFLECT_BASE, Reflection.REFLECT_HORIZON, Reflection.MASK].includes(layer.reflection)) {
        const origData = layer.getImageData()
        for (let i = 0; i < origData.data.length; i += 1) {
          if (origData.data[i] !== TRANSPARENT_INDEX) {
            mask[i] = 0
          }
        }
      }
    }
    return maskArray
  }
}