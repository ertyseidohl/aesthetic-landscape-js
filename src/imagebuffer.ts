import { Color } from './color'

function assert(val: boolean, str: string) {
  if (!val) {
    throw new Error("Assertion failed: " + str)
  }
}

export class ImageBuffer {
  // From http://jsfiddle.net/andrewjbaker/Fnx2w/
  imageData: ImageData
  buffer: ArrayBuffer
  imageDataView8: Uint8ClampedArray
  imageDataView32: Uint32Array

  constructor(width: number, height: number) {
    this.imageData = new ImageData(width, height)
    this.buffer = new ArrayBuffer(this.imageData.data.length)
    this.imageDataView8 = new Uint8ClampedArray(this.buffer)
    this.imageDataView32 = new Uint32Array(this.buffer)
  }

  get width(): number {
    return this.imageData.width
  }

  get height(): number {
    return this.imageData.height
  }

  getPixel(x: number, y:number): number {
    return this.imageDataView32[y * this.imageData.width + x]
  }

  setPixel(x: number, y: number, color: Color): void {
    this.imageDataView32[y * this.imageData.width + x] = color.asNumber()
  }

  setPixels(x: number, y: number, width: number, height: number, color: Color) {
    assert(x >= 0, "x >= 0")
    assert(width > 0, "width > 0")
    assert(y >= 0, "y >= 0")
    assert(height > 0, "height > 0")
    assert(x + width <= this.imageData.width, "x + width <= this.imageData.width")
    assert(y + height <= this.imageData.height, "y + height <= this.imageData.height")

    const colorI32 = color.asNumber()

    for (let i = y; i < y + height; i++) {
      for(let j = x; j < x + width; j++) {
        this.imageDataView32[i * this.imageData.width + j] = colorI32
      }
    }
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number, color: Color) {
    // Writing my own since the built-in implementation uses antialiasing.
    // Ellipse point checking based on https://math.stackexchange.com/a/76463
    // and https://stackoverflow.com/a/51896645/374601

    assert(radiusX > 0, "radiusX > 0")
    assert(radiusY > 0, "radiusY > 0")
    assert(startAngle !== endAngle, "startAngle !== endAngle")

    const insideAngle = (x: number, y: number, i: number, j: number) : boolean => {
      // Ok I can't figure this out right now but for whatever reason, this algo considers
      // the origin 0 deg to be on the left half (where 180 deg usually is). Just going to 
      // flip over all of my coordinates and solve it later...
      if (x == i && y == j) {
        // Fill pixel at origin of arc
        return true
      }
      
      let angle = Math.atan2(y - j, x - i)
      if (angle < 0) {
        // Fix 180 deg discontinuity. From https://stackoverflow.com/a/1311124/374601
        angle += Math.PI * 2
      }
      if (startAngle < endAngle) {
        return startAngle <= angle && angle <= endAngle
      } else {
        if (angle >= startAngle) {
          return true
        }
        if (angle <= endAngle) {
          return true
        }
        return false
      }
    }

    const rX2 = radiusX * radiusX
    const rY2 = radiusY * radiusY

    for (let j = y - radiusY; j < y + radiusY; j++) {
      for (let i = x - radiusX; i < x + radiusX; i++) {
        if ((Math.pow(i - x, 2) / rX2) + (Math.pow(j - y, 2) / rY2) < 1) {
          if (insideAngle(x, y, i, j)) {
            this.setPixel(i, j, color)
          }
        }
      }
    }
  }

  swap(x1: number, y1: number, x2: number, y2: number) {
    [this.imageDataView32[y1 * this.imageData.width + x1],
      this.imageDataView32[y2 * this.imageData.width + x2]] = [
      this.imageDataView32[y2 * this.imageData.width + x2],
      this.imageDataView32[y1 * this.imageData.width + x1]]
  }

  getImageData(): ImageData {
    this.imageData.data.set(this.imageDataView8)
    return this.imageData
  }
}