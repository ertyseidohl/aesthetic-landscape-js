export class Random {

  random: () => number

  constructor(seed: string) {
    const seedFunc: () => number = this.xmur3(seed)
    this.random = this.xorshift128plus_32b(seedFunc(), seedFunc(), seedFunc(), seedFunc())
  }

  choice(arr: unknown[]) {
    const index: number = Math.floor(this.random() * arr.length)
    return arr[index]
  }

  randint(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(this.random() * (max - min) + min)
  }

  triangular(lower: number, upper: number, mode: number = null): number {
    mode = mode != null ? mode : (upper + lower) / 2 // Halfway between lower and upper
    // From https://simjs.z5.web.core.windows.net/_downloads/random-0.26-debug.js
    const c = (mode - lower) / (upper - lower)
    const u = this.random()
    if (u <= c) {
      return lower + Math.sqrt(u * (upper - lower) * (mode - lower))
    } else {
      return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode))
    }
  }

  xmur3(str: string): () => number {
    // From https://github.com/bryc/code/blob/master/jshash/PRNGs.md
    let h = 1779033703 ^ str.length
    for(let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
      h = h << 13 | h >>> 19
    }
    return () => {
      h = Math.imul(h ^ h >>> 16, 2246822507)
      h = Math.imul(h ^ h >>> 13, 3266489909)
      return (h ^= h >>> 16) >>> 0
    }
  }

  xorshift128plus_32b(a: number, b: number, c: number, d: number): () => number {
    // From https://github.com/bryc/code/blob/master/jshash/PRNGs.md
    return () => {
      let x = a >>> 0
      let y = b >>> 0
      const z = c >>> 0
      const w = d >>> 0

      const t = w + y + (x !== 0 && z >= (-x>>>0) ? 1 : 0)
      y ^= y << 23 | x >>> 9
      x ^= x << 23

      a = z
      b = w
      c = x ^ z ^ (x >>> 18 | y << 14) ^ (z >>> 5 | w << 27)
      d = y ^ w ^ (y >>> 18) ^ (w >>> 5)

      // Original fn returns a 32 bit int, we want a float in [0, 1)
      return (t >>> 0) / 0xffffffff
    }
  }
}
