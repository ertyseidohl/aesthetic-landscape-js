import { Color } from './color'

export class Lerp {
  step = 0

  steps: number

  startColor: Color

  rStep: number
  gStep: number
  bStep: number

  constructor(color1: Color, color2: Color, steps: number) {
    this.startColor = Color.from(color1)
    this.steps = steps
    this.rStep = (color2.red - color1.red) / (steps - 1)
    this.gStep = (color2.green - color1.green) / (steps - 1)
    this.bStep = (color2.blue - color1.blue) / (steps - 1)
  }

  next(): Color {
    if (this.step < this.steps) {
      const result = new Color(
        this.startColor.red + (this.rStep * this.step),
        this.startColor.green + (this.gStep * this.step),
        this.startColor.blue + (this.bStep * this.step)
      )
      this.step += 1
      return result
    } else {
      return null
    }
  }
}