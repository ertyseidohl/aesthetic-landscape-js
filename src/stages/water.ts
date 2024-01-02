import { Stage } from './stage'
import { State } from '../state'
import { Layer } from '../layer'
import { Color } from '../color'
import { ImageBuffer } from '../imagebuffer'
import { BitMask } from '../bitmask'
import { BG_LIGHT_INDEX, BG_LIGHTER_INDEX, WHITE_INDEX, TRANSPARENT_RGB, BG_DARKER_INDEX } from '../colors'
import { Reflection } from '../reflection'
import { LayerType } from '../layertype'

class Reflector {
  constructor(private height: number, private width: number, private horizon: number,
    private origLayer: Layer, private reflLayer: Layer, private mask: BitMask,
    private color: Color, private waterColor: Color) {}

  public reflectBase(): void {
    for (let x = 0; x < this.width; x ++) {
      this.castRay(x, this.horizon)
    }
  }

  public get layer() {
    return this.reflLayer;
  }

  public reflectHorizon(excludeColorNumbers: number[] = []) {
    excludeColorNumbers.push(TRANSPARENT_RGB.asNumber())
    for (let yOffset = 0; yOffset < this.height - this.horizon + 1; yOffset ++) {
      if (yOffset % 2 == 0) {
        const origY: number = this.horizon - yOffset
        const y: number = this.horizon + yOffset - 1
        for (let x = 0; x < this.width; x++) {
          const origPixel: number = this.origLayer.imageBuffer.getPixel(x, origY)
          if (this.mask.get(x, y) && !excludeColorNumbers.includes(origPixel)) {
            this.reflLayer.imageBuffer.setPixel(x, y, this.color)
          }
        }
      }
    }
  }

  private castRay(x: number, reflPoint: number) {
    let y = reflPoint
    while (y < this.height) {
      if (this.origLayer.imageBuffer.getPixel(x, y) == TRANSPARENT_RGB.asNumber()) {
        y = this.castWater(x, y)
      } else {
        y = this.castLand(x, y)
      }
    }
  }

  private castLand(x: number, y: number): number {
    while (y < this.height && this.origLayer.imageBuffer.getPixel(x, y) != TRANSPARENT_RGB.asNumber()) {
      y ++
    }
    return y
  }

  private castWater(x: number, reflPoint: number): number {
    let y = reflPoint;
    while(y < this.height && this.origLayer.imageBuffer.getPixel(x, y) == TRANSPARENT_RGB.asNumber()) { 
      const reflY = reflPoint + (reflPoint - y) - 1 // what?
      if (this.origLayer.imageBuffer.getPixel(x, reflY) == TRANSPARENT_RGB.asNumber()) {
        // we have hit water again
        return y + 1
      }
      if (this.mask.get(x, y)) {
        if (y % 2 == 0) {
          this.reflLayer.imageBuffer.setPixel(x, y, this.color)
        } else {
          this.reflLayer.imageBuffer.setPixel(x, y, this.waterColor)
        }
      }
      y += 1
    }
    return y
  }
  
}

export class Water implements Stage {
  public run(state: State): Layer[] {
    const waterColor = state.palette[BG_LIGHT_INDEX]
    const waterReflColor = state.palette[BG_LIGHTER_INDEX]
    const moonReflColor = state.palette[WHITE_INDEX]

    const layers: Layer[] = []

    // Create mask
    const mask: BitMask = this.getWaterMask(state.layers, state.width, state.height)

    // Fill water layer with water color
    const fillWaterLayer: Layer = new Layer(state.width, state.height, Reflection.NONE, LayerType.WATER)
    for (let y = 0; y < state.height; y++) {
      for (let x = 0; x < state.width; x++) {
        if (mask.get(x, y) == true) {
          fillWaterLayer.imageBuffer.setPixel(x, y, waterColor)
        }
      }
    }

    layers.push(fillWaterLayer)

    state.layers.filter(l => l.layerType == LayerType.MOON).forEach(moonLayer => {
      const reflLayer = new Layer(state.width, state.height, Reflection.IS_REFLECTION, LayerType.REFLECTION);
      const reflector = new Reflector(state.width, state.height, state.horizon, moonLayer, reflLayer, mask, moonReflColor, waterColor)
      reflector.reflectHorizon([state.palette[BG_DARKER_INDEX].asNumber()])
      layers.push(reflector.layer)
    })

    return layers
  }

  private static addMask = (bitField: BitMask, currentLayer: ImageBuffer): BitMask => {
    for (let y = 0; y < currentLayer.height; y++) {
      for (let x = 0; x < currentLayer.width; x++) {
        if (currentLayer.getPixel(x, y) != TRANSPARENT_RGB.asNumber()) {
          bitField.set(x, y, true)
        }
      }
    }
    return bitField
  } 

  private getWaterMask(layers: Layer[], width: number, height: number): BitMask {
    return layers.filter(
      (l: Layer) => [Reflection.REFLECT_BASE, Reflection.REFLECT_HORIZON, Reflection.MASK].includes(l.reflection))
      .map((l: Layer) => l.imageBuffer)
      .reduce(Water.addMask, new BitMask(width, height, true))
  }
}
