import { Stage } from './stage'
import { State } from '../state'
import { Layer } from '../layer'
import { Color } from '../color'
import { ImageBuffer } from '../imagebuffer'
import { BitMask } from '../bitmask'
import { BG_LIGHT_INDEX, BG_LIGHTER_INDEX, TRANSPARENT_RGB, WHITE_INDEX, WHITE_RGB } from '../colors'
import { Reflection } from '../reflection'
import { LayerType } from '../layertype'
import { Moon } from './moon'
import { Random } from '../random'

const DEBUG_DRAW_WATER_MASK = false

class Reflector {
  constructor(private width: number, private height: number, private horizon: number,
    private origLayer: Layer, private reflLayer: Layer, private mask: BitMask,
    private color: Color, private waterColor: Color) { }

  public reflectBase(): void {
    for (let x = 0; x < this.width; x ++) {
      this.castRay(x, this.horizon)
    }
  }

  public get layer() {
    return this.reflLayer;
  }

  public reflectHorizon() {
    const excludeColorNumbers = this.origLayer.unlitColors.map(c => c.asNumber())
    excludeColorNumbers.push(0) // Don't reflect where there isn't anything to reflect
    for (let yOffset = 0; yOffset < Math.min(this.horizon, this.height - this.horizon); yOffset += 2) {
        const origY: number = this.horizon - yOffset
        const y: number = this.horizon + yOffset
        for (let x = 0; x < this.width; x++) {
          const origPixel: number = this.origLayer.imageBuffer.getPixel(x, origY)
          if (!this.mask.isMasked(x, y) && !excludeColorNumbers.includes(origPixel)) {
            this.reflLayer.imageBuffer.setPixel(x, y, this.color)
          }
        }
    }
  }

  private castRay(x: number, reflPoint: number) {
    let y = reflPoint
    while (y < this.height) {
      if (this.origLayer.imageBuffer.getPixel(x, y) == 0) {
        y = this.castDrawWater(x, y)
      } else {
        y ++
      }
    }
  }

  private castDrawWater(x: number, reflPoint: number): number {
    let y = reflPoint;
    while(y < this.height && this.origLayer.imageBuffer.getPixel(x, y) == 0) {
      const reflY = reflPoint + (reflPoint - y) - 1 // what?
      if (this.origLayer.imageBuffer.getPixel(x, reflY) == 0) {
        // we have hit water again
        return y + 1
      }
      if (!this.mask.isMasked(x, y)) {
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
    const fillWaterLayer: Layer = new Layer(state.width, state.height, Reflection.NONE, LayerType.WATER, [])
    for (let y = 0; y < state.height; y++) {
      for (let x = 0; x < state.width; x++) {
        if (!mask.isMasked(x, y)) {
          fillWaterLayer.imageBuffer.setPixel(x, y, waterColor)
        }
      }
    }

    layers.push(fillWaterLayer)

    // Specifically go in z-order
    for (let layerType of [LayerType.MOON, LayerType.MOUNTAIN, LayerType.ROCKS]) {
      const reflColor = layerType == LayerType.MOON ? moonReflColor : waterReflColor
      state.layers.filter(layer => layer.layerType == layerType).forEach(layer => {
        const reflLayer = new Layer(state.width, state.height, Reflection.IS_REFLECTION, LayerType.REFLECTION, [])
        const reflector = new Reflector(state.width, state.height, state.horizon, layer, reflLayer, mask, reflColor, waterColor)
        switch (layer.reflection) {
          case Reflection.REFLECT_HORIZON:
            reflector.reflectHorizon()
            break
          case Reflection.REFLECT_BASE:
            reflector.reflectBase()
            break
          default:
            console.log("Unknown reflection type")
        }
        layers.push(reflector.layer)
      })
    }

    layers.push(this.generateWaterLights(state, mask))

    if (DEBUG_DRAW_WATER_MASK) {
      const debugDrawWaterMaskLayer: Layer = new Layer(state.width, state.height, Reflection.NONE, LayerType.WATER, [])
      for (let y = 0; y < state.height; y++) {
        for (let x = 0; x < state.width; x++) {
          if (mask.isMasked(x, y)) {
            debugDrawWaterMaskLayer.imageBuffer.setPixel(x, y, TRANSPARENT_RGB)
          }
        }
      }
      layers.push(debugDrawWaterMaskLayer)
    }

    return layers
  }

  private generateWaterLights(state: State, mask: BitMask): Layer {
    const waterLightsLayer = new Layer(state.width, state.height, Reflection.IS_REFLECTION, LayerType.REFLECTION, [])
    const random: Random = new Random(state.baseSeed)

    for (let y = state.horizon; y < state.height; y ++) {
      if (random.random() < 0.1) {
        const end = random.randint(state.width * 2/3, state.width);
        for (let x = random.randint(0, state.width / 3); x < end; x ++) {
          if (!mask.isMasked(x, y) && random.random() < 0.8) {
            waterLightsLayer.imageBuffer.setPixel(x, y, WHITE_RGB)
          }
        }
        y += 2 // Prevent bunching
      }
    }

    return waterLightsLayer
  }

  private static addMask = (bitField: BitMask, currentImageBuffer: ImageBuffer): BitMask => {
    for (let y = 0; y < currentImageBuffer.height; y++) {
      for (let x = 0; x < currentImageBuffer.width; x++) {
        if (currentImageBuffer.getPixel(x, y) != 0) {
          bitField.mask(x, y)
        }
      }
    }
    return bitField
  }

  private getWaterMask(layers: Layer[], width: number, height: number): BitMask {
    return layers.filter(
      (l: Layer) => [Reflection.REFLECT_BASE, Reflection.REFLECT_HORIZON, Reflection.MASK].includes(l.reflection))
      .map((l: Layer) => l.imageBuffer)
      .reduce(Water.addMask, new BitMask(width, height))
  }
}
