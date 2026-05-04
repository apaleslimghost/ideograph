import PoissonDiskSampling from 'poisson-disk-sampling'
import './index.css'
import * as emoji from 'node-emoji'

const button = document.querySelector<HTMLDivElement>('#add')!
const space = document.querySelector<HTMLDivElement>('#space')!

const emojis: {emoji: string, x: number, y: number, element: HTMLElement, connections?: number[]}[] = []
const connections: [number, number][] = []

const sample = new PoissonDiskSampling({
  shape: [
    space.clientWidth,
    space.clientHeight
  ],
  minDistance: 100
})

function addEmoji(event: TouchEvent | MouseEvent) {
  event.stopImmediatePropagation()

  const e = emoji.random().emoji

  const el = document.createElement('div')
  el.classList.add('emoji')
  el.innerHTML = e

  const [x, y] = sample.next() ?? [
    space.clientWidth / 2,
    space.clientHeight / 2
  ]

  sample.addPoint([x, y])

  const index = emojis.push({
    emoji: e,
    x,
    y,
    element: el
  })

  el.style.translate = '100px 100px'
  el.dataset.index = (index - 1).toString()

  space.append(el)
}

requestAnimationFrame(function render() {
  for(const e of emojis) {
    e.element.style.translate = `${e.x}px ${e.y}px`
    e.element.dataset.connections = e.connections?.join()
  }

  requestAnimationFrame(render)
})

button.addEventListener('click', addEmoji)
button.addEventListener('touchstart', addEmoji)

const isEmoji = (e: EventTarget | null): e is HTMLElement => (
  e instanceof HTMLElement && e.classList.contains('emoji')
)

let dragging: HTMLElement | undefined

function drag(event: MouseEvent) {
  if(!(dragging && dragging.dataset.index)) return

  const e = emojis[parseInt(dragging.dataset.index)]
  e.x = event.x
  e.y = event.y
}

space.addEventListener('mousedown', (event) => {
  if(!isEmoji(event.target)) return

  event.target.classList.add('dragging')
  dragging = event.target
})

space.addEventListener('mouseup', (event) => {
  if(!(dragging && dragging.dataset.index)) return

  dragging.classList.remove('dragging')

  const e = emojis[parseInt(dragging.dataset.index)]
  for(const [i, f] of emojis.entries()) {
    if(f.element !== dragging && Math.hypot(e.x - f.x, e.y - f.y) < 20) {
      const c = connections.push([parseInt(dragging.dataset.index), i]) - 1
      e.connections = e.connections?.concat(c) ?? [c]
      f.connections = f.connections?.concat(c) ?? [c]
    }
  }

  dragging = undefined
})

space.addEventListener('mousemove', drag)
