// Comes from https://stackoverflow.com/a/25807014/374601
export class BitMask {

  private values: Uint32Array
  private width: number
    
  constructor(width: number, height: number) {
    const size: number = Math.ceil((width * height) / 32) | 0
    this.width = width
    this.values = new Uint32Array(size)
  }

  isMasked(x: number, y: number): boolean {
    const i = y * this.width + x
    const index = (i / 32) | 0
    const bit = i % 32
    return (this.values[index] & (1 << bit)) !== 0
  }

  mask(x: number, y: number): void {
    const i = y * this.width + x
    const index = (i / 32) | 0
    const bit = i % 32
    this.values[index] |= 1 << bit
  }
}