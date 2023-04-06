import { Random } from './random'
import { Lerp } from './lerp'
import { Color } from './color'

export type Palette = Color[]

export const WHITE_INDEX = 0
export const BG_DARKEST_INDEX = 1
export const BG_DARKER_INDEX = 2
export const BG_DARK_INDEX = 3
export const BG_LIGHT_INDEX = 4
export const BG_LIGHTER_INDEX = 5
export const BG_LIGHTEST_INDEX = 6
export const FG_DARK_INDEX = 7
export const FG_MID_INDEX = 8
export const FG_LIGHT_INDEX = 9
export const TRANSPARENT_INDEX = 10

export const WHITE_RGB = new Color(0xff, 0xff, 0xff)
export const TRANSPARENT_RGB = new Color(0xff, 0x00, 0xff)

const _purples = [
  new Color(0x0b, 0x00, 0x84),
  new Color(0x53, 0x09, 0xd3),
  new Color(0x95, 0x5f, 0xf3),
]

const _pinks = [
  new Color(0xe3, 0xba, 0xff),
  new Color(0xed, 0xd2, 0xff),
  new Color(0xff, 0xda, 0xf1),
]

const _teals = [
  new Color(0x33, 0xaf, 0xe0),
  new Color(0x48, 0xd6, 0xff),
  new Color(0x93, 0xed, 0xff),
]

const _oranges = [
  new Color(0xdc, 0x2a, 0x5a),
  new Color(0xff, 0x5c, 0x66),
  new Color(0xff, 0xd9, 0xa6),
]

const _yellows = [
  new Color(0xff, 0xeb, 0xc7),
  new Color(0xff, 0xb4, 0xbb),
  new Color(0xff, 0x9b, 0xb8),
]

const choices = [
  _yellows,
  _oranges,
  _pinks,
  _purples,
  _teals,
]

export function generatePalette(baseSeed: string): Palette {
  const random: Random = new Random(baseSeed)
  const backgroundChoice = random.choice(choices) as Palette
  console.log(backgroundChoice)
  const backgroundLerp: Lerp = new Lerp(backgroundChoice[0], backgroundChoice[2], 6)
  const foregroundBase = random.choice(choices) as Palette

  return [
    WHITE_RGB, // 0
    backgroundLerp.next(), // 1
    backgroundLerp.next(), // 2
    backgroundLerp.next(), // 3
    backgroundLerp.next(), // 4
    backgroundLerp.next(), // 5
    backgroundLerp.next(), // 6
    foregroundBase[0], // 7
    foregroundBase[1], // 8
    foregroundBase[2], // 9
    TRANSPARENT_RGB, // 10
  ]
}