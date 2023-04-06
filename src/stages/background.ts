import { State } from '../state'
import { Color } from '../color'
import { WHITE_RGB, BG_DARKEST_INDEX, BG_LIGHTEST_INDEX } from '../colors'
import { Stage } from './stage'
import { Random } from '../random'

export class Background implements Stage {

  backgroundColors: Color[]

  run(state: State) {
    console.log("running background")
    // const random: Random = new Random(state.baseSeed)

    this.backgroundColors = state.palette.slice(BG_DARKEST_INDEX, BG_LIGHTEST_INDEX + 1)

    // this._fill_bands(state)

    // Original code had "dither", "diag", and "none" but was hardcoded to "dither"
    // since that looked the best.
    // this._dither(random, state)

    // this._fill_stars(random, state)
  } 

  _dither(random: Random, state: State): void {
    const stampSize = Math.floor((random.triangular(2, Math.floor(state.horizon / this.backgroundColors.length))))

    const bandEdges: number[] = []
    for(let i = 1; i < this.backgroundColors.length; i++) {
      bandEdges.push(Math.floor(state.horizon / this.backgroundColors.length) * i)
    }
    
    /* eslint-disable */
    const stampPattern: number[] = Array(random.randint(3, 10)).fill(0).concat(Array(random.randint(3, 6)).fill(2))
    /* eslint-enable */

    for (const edge of bandEdges) {
      for (let x = 0; x < state.width; x++) {
        if (x % 2 == 0){
          for (let yOffset = 0; yOffset < stampSize; yOffset += stampPattern[Math.floor(x / 2) % stampPattern.length]){
            if (yOffset % 2 != 0) {
              state.imageBuffer.swap(x, edge + yOffset, x, edge - yOffset)
            }
          }
        }
      }
    }
  }

  _fill_bands(state: State): void {
    console.log("Fill bands")
    const bandHeight = Math.floor(state.horizon / this.backgroundColors.length)
    for (let i = 0; i < this.backgroundColors.length; i++) {
      state.imageBuffer.setPixels(0, i * bandHeight, state.imageBuffer.width, bandHeight, this.backgroundColors[i])
    }
  }

  _fill_stars(random: Random, state: State): void {
    // Some differences from the original code here.
    // Small Stars
    const smallStarCount = random.randint(10, 30)
    for (let i = 0; i < smallStarCount; i++) {
      const x = random.randint(0, state.imageBuffer.width)
      const y = random.triangular(0, state.imageBuffer.height, 0)
      state.imageBuffer.setPixel(x, y, WHITE_RGB)
    }
    // Big Stars
    const largeStarCount = random.randint(5, 10)
    for (let i = 0; i < largeStarCount; i++) {
      const x = random.randint(0, state.imageBuffer.width)
      const y = random.triangular(0, state.imageBuffer.height, 0)
      state.imageBuffer.setPixel(x, y, WHITE_RGB)
      if (x - 1 >= 0) {
        state.imageBuffer.setPixel(x - 1, y, WHITE_RGB)
      }
      if (x + 1 <= state.imageBuffer.width) {
        state.imageBuffer.setPixel(x + 1, y, WHITE_RGB)
      }
      if (y - 1 >= 0) {
        state.imageBuffer.setPixel(x, y - 1, WHITE_RGB)
      }
      if (y + 1 < state.horizon) {
        state.imageBuffer.setPixel(x, y + 1, WHITE_RGB)
      }
    }
  }
}