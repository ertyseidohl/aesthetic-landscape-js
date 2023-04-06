// import { State } from '../state'
// import { WHITE, BG_DARKER } from '../colors'

// const COLOR_LIGHT = WHITE
// const COLOR_SHADOW = BG_DARKER

// const SQUASH_AMOUNT = 2

// export class Moon extends Stage {
//   const moonRadius = Math.floor(random.triangular(8, 32))
//   const moonX = Math.floor(random.triangular(0, width * 0.66 ))
//   const moonY = Math.floor(random.triangular(moon_r, horizon / 2))

//   run (state: State) {

//   }

//   function _drawNewMoon(x, y, r, draw, seed_obj): void {
//     draw.ellipse(((x - r - SQUASH_AMOUNT, y - r), (x + r + SQUASH_AMOUNT, y + r)), COLOR_SHADOW)
//   }

// }



// def moon(layers, layer_factory, seed_obj):
//   random.seed(seed_obj['base_seed'])
//   horizon = seed_obj['horizon']
//   width = seed_obj['width']
//   height = seed_obj['height']

//   layer = layer_factory('moon', reflection.REFLECT_HORIZON)

  

//   draw = ImageDraw.Draw(layer.img)

//   phase = random.choice((
//     _draw_crescent_moon,
//     _draw_gibbous_moon,
//     _draw_crescent_moon,
//     _draw_gibbous_moon,
//     _draw_crescent_moon,
//     _draw_gibbous_moon,
//   ))

//   phase(moon_x, moon_y, moon_r, draw, seed_obj)

//   draw.rectangle(((0, seed_obj['horizon']), (seed_obj['width'], seed_obj['height'])), fill=colors.TRANSPARENT)

//   return layer

// def _draw_crescent_moon(x, y,  r, draw, seed_obj):
//   draw.ellipse(((x - r - SQUASH_AMOUNT, y - r), (x + r + SQUASH_AMOUNT, y + r)), COLOR_SHADOW)

//   draw.pieslice(
//     ((x - r, y - r + 1), (x + r, y + r - 1)),
//     270,
//     90,
//     fill=COLOR_LIGHT
//   )

//   crescent_width = random.randint(0, r)

//   draw.pieslice(
//     ((x - r + crescent_width, y - r + 1), (x + r - crescent_width, y + r - 1)),
//     270,
//     90,
//     fill=COLOR_SHADOW
//   )

// def _draw_gibbous_moon(x, y, r, draw, seed_obj):
//   #shadow
//   draw.ellipse(((x - r - SQUASH_AMOUNT, y - r), (x + r + SQUASH_AMOUNT, y + r)), COLOR_SHADOW)
//   # right
//   draw.chord(
//     ((x - r, y - r + 1), (x + r, y + r - 1)),
//     270,
//     90,
//     fill=COLOR_LIGHT
//   )
//   #left
//   gibbous_shift = random.randint(0, r // 2)
//   draw.chord(
//     ((x - r + gibbous_shift, y - r + 1), (x + r - gibbous_shift, y + r - 1)),
//     90,
//     270,
//     fill=COLOR_LIGHT
//   )
