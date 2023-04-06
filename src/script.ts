import { Motif } from './motif'

const seed = Math.random().toString()
const canvas = document.getElementById("canvas") as HTMLCanvasElement

Motif.render(seed, canvas)




