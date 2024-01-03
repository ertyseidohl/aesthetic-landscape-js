export class Color {
  constructor(public red: number, public green: number, public blue: number) {}

  static from(other: Color): Color {
    return new Color(other.red, other.green, other.blue)
  }

  asUint8Array(): Uint8Array {
    return new Uint8Array([this.red, this.green, this.blue])
  }

  asNumber(): number {
    return ((255   << 24) | // alpha
      (this.blue << 16) |   // blue
      (this.green <<  8) |  // green
      this.red)             // red
      >>> 0                 // as unsigned  
  }

  toString(): string {
    return `rgb(${this.red}, ${this.blue}, ${this.green})`
  }
}