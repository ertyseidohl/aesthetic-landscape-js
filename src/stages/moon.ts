import { State } from '../state'
import { WHITE_INDEX, BG_DARKER_INDEX, BG_DARKEST_INDEX } from '../colors'
import { Random } from '../random'
import { Reflection } from '../reflection'
import { Layer } from '../layer'
import { Color } from '../color'
import { Stage } from './stage'
import { ImageBuffer } from '../imagebuffer'

const COLOR_LIGHT_INDEX = WHITE_INDEX
const COLOR_DARK_INDEX = BG_DARKER_INDEX
const COLOR_DARKER_INDEX = BG_DARKEST_INDEX

export class Moon implements Stage {
  private colorLight: Color
  private colorDark: Color
  private colorDarker: Color
  private random: Random

  run (state: State) {
    const layer = new Layer(state.width, state.height, Reflection.REFLECT_HORIZON)
    
    this.random = new Random(state.baseSeed)

    const moonRadius = Math.floor(this.random.triangular(8, 32))
    const moonX = Math.floor(this.random.triangular(0, state.width * 0.66))
    const moonY = Math.floor(this.random.triangular(moonRadius, state.horizon / 2))
    

    this.colorLight = state.palette[COLOR_LIGHT_INDEX]
    this.colorDark = state.palette[COLOR_DARK_INDEX]
    this.colorDarker = state.palette[COLOR_DARKER_INDEX]

    const phase = this.random.choice([
      this.drawCrescentMoon.bind(this),
      this.drawGibbousMoon.bind(this),
      this.drawCrescentMoon.bind(this),
      this.drawGibbousMoon.bind(this),
      this.drawCrescentMoon.bind(this),
      this.drawGibbousMoon.bind(this),
      this.drawNewMoon.bind(this)
    ]) as (imageBuffer: ImageBuffer, x: number, y: number, r: number) =>  void

    phase(layer.imageBuffer, moonX, moonY, moonRadius)

    return [layer]
  }

  private drawNewMoon(imageBuffer: ImageBuffer, x: number, y: number, r: number): void {
    imageBuffer.ellipse(x, y, r + 2, r + 2, 0, 2 * Math.PI, this.colorDark)
    imageBuffer.ellipse(x, y, r, r, 0, 2 * Math.PI, this.colorDarker)
  }

  private drawCrescentMoon(imageBuffer: ImageBuffer, x: number, y: number, r: number) {
    const crescentWidth = Math.floor(this.random.triangular(5, r, 5))

    // Dark outline
    imageBuffer.ellipse(x, y, r + 2, r + 2, 0, 2 * Math.PI, this.colorDark)

    // Light Crescent (circle)
    // Remember that angles are flipped 180 for WHATEVER reason
    imageBuffer.ellipse(x, y, r, r, 1.5 * Math.PI, 0.5 * Math.PI, this.colorLight)

    // Dark Crescent Fill
    // Remember that angles are flipped 180 for WHATEVER reason
    imageBuffer.ellipse(x + 1, y, r - crescentWidth, r, 1.5 * Math.PI, 0.5 * Math.PI, this.colorDark)
  }

  drawGibbousMoon(imageBuffer: ImageBuffer, x: number, y: number, r: number) {
    const gibbousShift = Math.floor(this.random.randint(0, r / 2))

    // Dark outline
    imageBuffer.ellipse(x, y, r + 2, r + 2, 0, 2 * Math.PI, this.colorDark)

    // Left half
    // Remember that angles are flipped 180 for WHATEVER reason
    imageBuffer.ellipse(x, y, r, r, 0.5 * Math.PI, 1.5 * Math.PI, this.colorLight)

    // Right half
    // Remember that angles are flipped 180 for WHATEVER reason
    imageBuffer.ellipse(x, y, r - gibbousShift, r, 1.5 * Math.PI, 0.5 * Math.PI, this.colorLight)
  }

}
