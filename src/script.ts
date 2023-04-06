import { Motif } from './motif'

const seed = "hello"
const canvas = document.getElementById("canvas") as HTMLCanvasElement

console.log("Running script!")

Motif.render(seed, canvas)

console.log("done")




