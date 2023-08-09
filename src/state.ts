import { Palette } from './colors'
import { Layer } from './layer'

export interface State {
	baseSeed: string
	horizon: number
	height: number
	width: number
	palette: Palette
	layers: Layer[]
}
