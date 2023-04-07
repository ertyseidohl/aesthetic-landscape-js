import { Reflection } from './reflection'
import { ImageBuffer } from './imagebuffer'

export class Layer {
  private _reflection: Reflection
  private _canvas: OffscreenCanvas

  private constructor(width: number, height: number, reflection: Reflection, imageBuffer: ImageBuffer = null) {
    this._reflection = reflection
    if (imageBuffer !== null) {
      this._canvas = new OffscreenCanvas(imageBuffer.width, imageBuffer.height)
      imageBuffer.paintCanvas(this._canvas.getContext("2d"))
    } else {
      this._canvas = new OffscreenCanvas(width, height)
    }
  }

  static ofCanvas(width: number, height: number, reflection: Reflection): Layer {
    return new Layer(width, height, reflection)
  }

  static ofImageBuffer(imageBuffer: ImageBuffer, reflection: Reflection): Layer {
    return new Layer(imageBuffer.width, imageBuffer.height, reflection, imageBuffer)
  }

  get canvas(): OffscreenCanvas {
    return this._canvas
  }

  get reflection() {
    return this._reflection
  }

  getBitmap(): ImageBitmap {
    return this._canvas.transferToImageBitmap()
  }
}