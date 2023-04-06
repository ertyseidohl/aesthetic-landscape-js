import { State } from '../state'

export interface Stage {
  run(state: State): void
}