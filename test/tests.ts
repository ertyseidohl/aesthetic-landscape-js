import { ImageBuffer } from '../src/imagebuffer'
import { Color } from '../src/color'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

function expect(name: string, fn : () => unknown, expected: unknown) {
  let result
  try {
    result = fn()
  } catch (err) {
    console.log('[ERROR] ' + name)
    console.log(err as string)
    return
  }
  if (result === expected) {
    console.log('[PASSED] ' + name)
  } else {
    console.log('[FAILED] ' + name)
    console.log(`Expected ${expected as string} got ${result as string}`)
  }
}

class Tests {
  run () {
    console.log ('Starting tests')
    this.imageBufferTests()
  }

  imageBufferTests() {
    const ib = new ImageBuffer(canvas)
    expect('width', () => ib.width, 800)
    expect('height', () => ib.height, 600)
    expect('isLittleEndian', () => ib.isLittleEndian, true) // Passes on my M1 mac :)
    expect('toEndianI32', () => ib.toEndianI32(new Color(0xff, 0x66, 0x11)) >>> 0, 4284879359)
    expect('set pixel color', () => {
      ib.setPixel(0, 0, new Color(0x11, 0x22, 0x33))
      ib.paintCanvas()
      return ctx.getImageData(0, 0, 1, 1).data.join(',')
    }, '17,51,34,255')

    expect('set pixels', () => {
      ib.setPixels(1, 1, 2, 2, new Color(0x44, 0x55, 0x66))
      ib.paintCanvas()
      return ctx.getImageData(1, 1, 2, 2).data.join(',')
    }, '68,102,85,255,68,102,85,255,68,102,85,255,68,102,85,255')
  }
}

const t = new Tests()
t.run()