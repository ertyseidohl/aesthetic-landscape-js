import { Reflection } from './reflection'
import { ImageBuffer } from './imagebuffer'
import { LayerType } from './layertype'
import { Color } from './color'

export class Layer {
  private _reflection: Reflection
  private _imageBuffer: ImageBuffer
  private _layerType: LayerType
  private _unlitColors: Color[]

  constructor(width: number, height: number, reflection: Reflection, layerType: LayerType, unlitColors: Color[]) {
    this._reflection = reflection
    this._imageBuffer = new ImageBuffer(width, height)
    this._layerType = layerType;
    this._unlitColors = unlitColors;
  }

  public get reflection(): Reflection {
    return this._reflection
  }

  public get imageBuffer(): ImageBuffer {
    return this._imageBuffer
  }

  public get layerType(): LayerType {
    return this._layerType
  }

  public getImageData(): ImageData {
    return this._imageBuffer.getImageData()
  }

  public get unlitColors(): Color[] {
    return this._unlitColors
  }
}