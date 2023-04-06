import { Reflection } from './reflection'
import { ImageBuffer } from './imagebuffer'

export class Layer {
  private _reflection: Reflection
  private _imageBuffer: ImageBuffer

  constructor(width: number, height: number, reflection: Reflection) {
    this._reflection = reflection
    this._imageBuffer = new ImageBuffer(width, height)
  }

  public get reflection() {
    return this._reflection
  }

  public get imageBuffer() {
    return this._imageBuffer
  }

  paintCanvas(ctx: CanvasRenderingContext2D) {
    this.imageBuffer.paintCanvas(ctx)
  }
}