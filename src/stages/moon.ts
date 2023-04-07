import { State } from '../state'
import { WHITE_INDEX, BG_DARKER_INDEX } from '../colors'
import { Random } from '../random'
import { Reflection } from '../reflection'
import { Layer } from '../layer'
import { Color } from '../color'
import { Stage } from './stage'

const COLOR_LIGHT_INDEX = WHITE_INDEX
const COLOR_DARK_INDEX = BG_DARKER_INDEX

export class Moon implements Stage {
  private colorLight: Color
  private colorDark: Color

  run (state: State) {
    const layer = Layer.ofCanvas(state.width, state.height, Reflection.REFLECT_HORIZON)
    const canvasContext = layer.canvas.getContext("2d")
    const random = new Random(state.baseSeed)
    const moonRadius = Math.floor(random.triangular(8, 32))
    const moonX = Math.floor(random.triangular(0, state.width * 0.66))
    const moonY = Math.floor(random.triangular(moonRadius, state.horizon / 2))
    

    this.colorLight = state.palette[COLOR_LIGHT_INDEX]
    this.colorDark = state.palette[COLOR_DARK_INDEX]

    this._drawNewMoon(canvasContext, moonX, moonY, moonRadius)

    return [layer]
  }

  _drawNewMoon(canvasContext: OffscreenCanvasRenderingContext2D, x: number, y: number, r: number): void {
    canvasContext.fillStyle = this.colorDark.toString()
    canvasContext.ellipse(x, y, r, r, 0, 0, 2 * Math.PI)
    canvasContext.fill()
  }

}
/*

 def newmoon:
  draw.ellipse(((x - r - SQUASH_AMOUNT, y - r), (x + r + SQUASH_AMOUNT, y + r)), COLOR_SHADOW)


def moon(layers, layer_factory, seed_obj):
  random.seed(seed_obj['base_seed'])
  horizon = seed_obj['horizon']
  width = seed_obj['width']
  height = seed_obj['height']

  layer = layer_factory('moon', reflection.REFLECT_HORIZON)

  

  draw = ImageDraw.Draw(layer.img)

  phase = random.choice((
    _draw_crescent_moon,
    _draw_gibbous_moon,
    _draw_crescent_moon,
    _draw_gibbous_moon,
    _draw_crescent_moon,
    _draw_gibbous_moon,
  ))

  phase(moon_x, moon_y, moon_r, draw, seed_obj)

  draw.rectangle(((0, seed_obj['horizon']), (seed_obj['width'], seed_obj['height'])), fill=colors.TRANSPARENT)

  return layer

def _draw_crescent_moon(x, y,  r, draw, seed_obj):
  draw.ellipse(((x - r - SQUASH_AMOUNT, y - r), (x + r + SQUASH_AMOUNT, y + r)), COLOR_SHADOW)

  draw.pieslice(
    ((x - r, y - r + 1), (x + r, y + r - 1)),
    270,
    90,
    fill=COLOR_LIGHT
  )

  crescent_width = random.randint(0, r)

  draw.pieslice(
    ((x - r + crescent_width, y - r + 1), (x + r - crescent_width, y + r - 1)),
    270,
    90,
    fill=COLOR_SHADOW
  )

def _draw_gibbous_moon(x, y, r, draw, seed_obj):
  #shadow
  draw.ellipse(((x - r - SQUASH_AMOUNT, y - r), (x + r + SQUASH_AMOUNT, y + r)), COLOR_SHADOW)
  # right
  draw.chord(
    ((x - r, y - r + 1), (x + r, y + r - 1)),
    270,
    90,
    fill=COLOR_LIGHT
  )
  #left
  gibbous_shift = random.randint(0, r // 2)
  draw.chord(
    ((x - r + gibbous_shift, y - r + 1), (x + r - gibbous_shift, y + r - 1)),
    90,
    270,
    fill=COLOR_LIGHT
  )
*/