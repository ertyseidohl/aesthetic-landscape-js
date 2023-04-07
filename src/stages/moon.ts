import { State } from '../state'
import { WHITE_INDEX, BG_DARKER_INDEX, BG_DARKEST_INDEX } from '../colors'
import { Random } from '../random'
import { Reflection } from '../reflection'
import { Layer } from '../layer'
import { Color } from '../color'
import { Stage } from './stage'

const COLOR_LIGHT_INDEX = WHITE_INDEX
const COLOR_DARK_INDEX = BG_DARKER_INDEX
const COLOR_DARKER_INDEX = BG_DARKEST_INDEX

export class Moon implements Stage {
  private colorLight: Color
  private colorDark: Color
  private colorDarker: Color
  private random: Random

  run (state: State) {
    const layer = Layer.ofCanvas(state.width, state.height, Reflection.REFLECT_HORIZON)
    const canvasContext = layer.canvas.getContext("2d")
    
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
    ])

    phase(canvasContext, moonX, moonY, moonRadius)

    return [layer]
  }

  private drawNewMoon(canvasContext: OffscreenCanvasRenderingContext2D, x: number, y: number, r: number): void {
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorDark.toString()
    canvasContext.ellipse(x, y, r + 2, r + 2, 0, 0, 2 * Math.PI)
    canvasContext.fill()

    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorDarker.toString()
    canvasContext.ellipse(x, y, r, r, 0, 0, 2 * Math.PI)
    canvasContext.fill()
  }

  private drawCrescentMoon(canvasContext: OffscreenCanvasRenderingContext2D, x: number, y: number, r: number) {
    const crescentWidth = this.random.triangular(5, r, 5)
    // Original code did not have the rotation option
    const rotation = -this.random.randint(0, 40)

    canvasContext.translate(x, y)
    canvasContext.rotate(rotation * Math.PI / 180)

    // Dark outline
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorDark.toString()
    canvasContext.ellipse(0, 0, r + 2, r + 2, 0, 0, 2 * Math.PI)
    canvasContext.fill()

    // Light Crescent (circle)
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorLight.toString()
    canvasContext.ellipse(0, 0, r, r, 0, 0.5 * Math.PI, 1.5 * Math.PI)
    canvasContext.fill()

    // Dark Crescent Fill
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorDark.toString()
    canvasContext.ellipse(1, 0, r - crescentWidth, r, 0, 0.5 * Math.PI, 1.5 * Math.PI)
    canvasContext.fill()

    canvasContext.resetTransform()
  }

  drawGibbousMoon(canvasContext: OffscreenCanvasRenderingContext2D, x: number, y: number, r: number) {
    const gibbousShift = this.random.randint(0, r / 2)

    canvasContext.translate(x, y)

    // Dark outline
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorDark.toString()
    canvasContext.ellipse(0, 0, r + 2, r + 2, 0, 0, 2 * Math.PI)
    canvasContext.fill()

    // Left half
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorLight.toString()
    canvasContext.ellipse(0, 0, r, r, 0, 0.5 * Math.PI, 1.5 * Math.PI)
    canvasContext.fill()

    // Right half
    canvasContext.beginPath()
    canvasContext.fillStyle = this.colorLight.toString()
    canvasContext.ellipse(0, 0, r - gibbousShift, r, 0, 1.5 * Math.PI, 0.5 * Math.PI)
    canvasContext.fill()    

    canvasContext.resetTransform()
  }

}
