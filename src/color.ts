export class Color {
  constructor(public red: number, public blue: number, public green: number) {}

  static from(other: Color): Color {
    return new Color(other.red, other.blue, other.green)
  }

  asUint8Array(): Uint8Array {
    return new Uint8Array([this.red, this.blue, this.green])
  }
}