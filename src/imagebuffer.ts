import { Color } from './color'

function assert(val: boolean, str: string) {
  if (!val) {
    throw new Error("Assertion failed: " + str)
  }
}

export class ImageBuffer {
  // From http://jsfiddle.net/andrewjbaker/Fnx2w/
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  imageData: ImageData
  buffer: ArrayBuffer
  imageDataView8: Uint8ClampedArray
  imageDataView32: Uint32Array
  isLittleEndian: boolean

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height)
    this.buffer = new ArrayBuffer(this.imageData.data.length)
    this.imageDataView8 = new Uint8ClampedArray(this.buffer)
    this.imageDataView32 = new Uint32Array(this.buffer)
    this.testEndianness()
  }

  get width(): number {
    return this.canvas.width
  }

  get height(): number {
    return this.canvas.height
  }

  testEndianness(): void {
    this.imageDataView32[1] = 0x0a0b0c0d
    this.isLittleEndian = !(this.imageDataView8[4] === 0x0a && this.imageDataView8[7] === 0x0d)
  }

  toEndianI32(color: Color) {
    if (this.isLittleEndian) {
      return (255   << 24) |    // alpha
        (color.blue << 16) |    // blue
        (color.green <<  8) |    // green
        color.red            // red
    } else {
      return (color.red << 24) |    // red
        (color.green << 16) |    // green
        (color.blue <<  8) |    // blue
        255              // alpha
    }
  }

  setPixel(x: number, y: number, color: Color): void {
    this.imageDataView32[y * this.canvas.width + x] = this.toEndianI32(color)
  }

  setPixels(x: number, y: number, width: number, height: number, color: Color) {
    assert(x >= 0, "x >= 0")
    assert(width > 0, "width > 0")
    assert(y >= 0, "y >= 0")
    assert(height > 0, "height > 0")
    assert(x + width <= this.canvas.width, "x + width <= this.canvas.width")
    assert(y + height <= this.canvas.height, "y + height <= this.canvas.height")

    const colorI32 = this.toEndianI32(color)

    for (let i = y; i < y + height; i++) {
      for(let j = x; j < x + width; j++) {
        this.imageDataView32[i * this.canvas.width + j] = colorI32
      }
    }
  }

  swap(x1: number, y1: number, x2: number, y2: number) {
    [this.imageDataView32[y1 * this.canvas.width + x1],
      this.imageDataView32[y2 * this.canvas.width + x2]] = [
      this.imageDataView32[y2 * this.canvas.width + x2],
      this.imageDataView32[y1 * this.canvas.width + x1]]
  }

  paintCanvas(): void {
    this.imageData.data.set(this.imageDataView8)
    this.ctx.putImageData(this.imageData, 0, 0)
  }
}