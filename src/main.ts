import './index.css'
import * as emoji from 'node-emoji'

const button = document.querySelector<HTMLDivElement>('#add')!
const space = document.querySelector<HTMLDivElement>('#space')!

const emojis: {emoji: string, x: number, y: number, element: HTMLElement}[] = []
const connections = []

function addEmoji(event: TouchEvent | MouseEvent) {
  event.stopImmediatePropagation()

  const e = emoji.random().emoji

  const el = document.createElement('div')
  el.classList.add('emoji')
  el.innerHTML = e

  const index = emojis.push({
    emoji: e,
    x: 100,
    y: 100,
    element: el
  })

  el.style.translate = '100px 100px'
  el.dataset.index = (index - 1).toString()

  space.append(el)
}

requestAnimationFrame(function render() {
  for(const e of emojis) {
    e.element.style.translate = `${e.x}px ${e.y}px`
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
  if(!dragging) return

  dragging.classList.remove('dragging')
  dragging = undefined
})

space.addEventListener('mousemove', drag)
