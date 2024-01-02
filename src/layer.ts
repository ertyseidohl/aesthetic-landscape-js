import { Reflection } from './reflection'
import { ImageBuffer } from './imagebuffer'
import { LayerType } from './layertype'

export class Layer {
  private _reflection: Reflection
  private _imageBuffer: ImageBuffer
  private _layerType: LayerType

  constructor(width: number, height: number, reflection: Reflection, layerType: LayerType) {
    this._reflection = reflection
    this._imageBuffer = new ImageBuffer(width, height)
    this._layerType = layerType;
  }

  get reflection(): Reflection {
    return this._reflection
  }

  get imageBuffer(): ImageBuffer {
    return this._imageBuffer
  }

  get layerType(): LayerType {
    return this._layerType
  }

  public getImageData(): ImageData {
    return this._imageBuffer.getImageData()
  }
}