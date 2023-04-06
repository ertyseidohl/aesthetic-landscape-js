import { Palette } from './colors'
import { ImageBuffer } from './imagebuffer'

export interface State {
	baseSeed: string
	horizon: number
	height: number
	width: number
	palette: Palette
	imageBuffer: ImageBuffer
}