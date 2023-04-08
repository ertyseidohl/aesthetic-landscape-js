import { Reflection } from './reflection'
import { ImageBuffer } from './imagebuffer'

export class Layer {
  private _reflection: Reflection
  private _imageBuffer: ImageBuffer

  constructor(width: number, height: number, reflection: Reflection) {
    this._reflection = reflection
    this._imageBuffer = new ImageBuffer(width, height)
  }

  get reflection(): Reflection {
    return this._reflection
  }

  get imageBuffer(): ImageBuffer {
    return this._imageBuffer
  }

  public paint(ctx: CanvasRenderingContext2D) {
    this._imageBuffer.paintCanvas(ctx)
  }
}