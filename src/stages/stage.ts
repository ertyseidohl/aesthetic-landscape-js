import { State } from '../state'
import { Layer } from '../layer'

export interface Stage {
  run(state: State): Layer[]
}