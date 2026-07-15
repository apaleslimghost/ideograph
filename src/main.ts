import { defineHex, Grid, type Hex, Orientation, type Point, rectangle, ring } from "honeycomb-grid";
import "./index.css";
import { create, type Polygon, Shape, SVG, type Text } from "@svgdotjs/svg.js";
import * as Tone from "tone";

const space = document.querySelector<HTMLDivElement>("#space")!;

type Context<R extends object = Record<string, unknown>> = {
	glyph: Glyph<R>,
	hex: Hex,
	cell: Cell<R>
}

type Message<T> = {
	neighbourhood: Hex[];
	self: Hex;
	data?: T;
	send: <T>(target: Hex, data: T) => void
};

function neighbourhood(hex: Hex): Hex[] {
	return Array.from(grid.traverse(ring({ center: hex, radius: 1 })));
}

const message = <T>(hex: Hex, data: T): Message<T> => ({
	neighbourhood: neighbourhood(hex),
	self: hex,
	data,
	send<T>(target: Hex, data: T) {
		const cell = cells.get(target);
		const msg = message(target, data)

		cell?.polygon
			.fill(cell.glyph ? "#CE93D8" : "#F3E5F5")
			.animate(200)
			.fill("#ffffff");

		const targetDirection = msg.neighbourhood.findIndex(
			h => hex.equals(h)
		) as HexSide

		if (cell?.glyph && cell.glyph.inlets.includes(targetDirection)) {
			cell.glyph.onMessage?.call({
				glyph: cell.glyph,
				hex,
				cell
			}, msg);
		}
	}
})

type Glyph<R extends object = Record<string, unknown>> = {
	name: string;
	shortcut: string;
	symbol: string;
	onMessage?: <T>(this: Context<R>, message: Message<T>) => void;
	onInit?: <T>(this: Context<R>, message: Message<T>) => void;
	onEnd?: <T>(this: Context<R>, message: Message<T>) => void;
	inlets: HexSide[];
	outlets: HexSide[];
};

type HexSide = 0 | 1 | 2 | 3 | 4 | 5;

type Cell<R extends object = Record<string, unknown>> = {
	polygon: Polygon;
	drawings: Shape[];
	glyph?: Glyph;
	rotation: HexSide;
} & R;

const glyph = <R extends object>(g: Glyph<R>) => g

const glyphs: Glyph[] = [
	glyph<{ loop?: Tone.Loop }>({
		name: "sun",
		shortcut: 's',
		symbol: "☉",
		onInit({ neighbourhood, send }) {
			this.cell.loop = new Tone.Loop(() => {
				neighbourhood.forEach((hex) => {
					send(hex, null);
				});
			}, "4n").start("1m");
		},
		onEnd() {
			this.cell.loop?.stop('1m')
		},
		inlets: [],
		outlets: [0, 1, 2, 3, 4, 5],
	}),
	{ name: "moon", shortcut: 'l', symbol: "☽", inlets: [], outlets: [] },
	{ name: "earth", shortcut: 'e', symbol: "♁", inlets: [], outlets: [] },
	{
		name: "mercury",
		shortcut: 'h',
		symbol: "☿",
		inlets: [],
		outlets: [],
	},
	{ name: "venus", shortcut: 'v', symbol: "♀", inlets: [], outlets: [] },
	{ name: "mars", shortcut: 'm', symbol: "♂", inlets: [], outlets: [] },
	{
		name: "jupiter",
		shortcut: 'j',
		symbol: "♃",
		inlets: [],
		outlets: [],
	},
	{
		name: "saturn",
		shortcut: 'z',
		symbol: "♄",
		inlets: [],
		outlets: [],
	},
	{
		name: "uranus",
		shortcut: 'u',
		symbol: "♅",
		inlets: [],
		outlets: [],
	},
	{
		name: "neptune",
		shortcut: 'n',
		symbol: "♆",
		inlets: [],
		outlets: [],
	},
	{
		name: "conjunction",
		shortcut: '=',
		symbol: "☌",
		inlets: [],
		outlets: [],
	},
	{
		name: "opposition",
		shortcut: '-',
		symbol: "☍",
		inlets: [],
		outlets: [],
	},
	{
		name: "aries",
		shortcut: '1',
		symbol: "♈︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "taurus",
		shortcut: '2',
		symbol: "♉︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "gemini",
		shortcut: '3',
		symbol: "♊︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "cancer",
		shortcut: '4',
		symbol: "♋︎",
		inlets: [],
		outlets: [],
	},
	{ name: "leo", shortcut: '5', symbol: "♌︎", inlets: [], outlets: [] },
	{
		name: "virgo",
		shortcut: '6',
		symbol: "♍︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "libra",
		shortcut: '7',
		symbol: "♎︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "scorpio",
		shortcut: '8',
		symbol: "♏︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "sagittarius",
		shortcut: '9',
		symbol: "♐︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "capricorn",
		shortcut: '0',
		symbol: "♑︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "aquarius",
		shortcut: '_',
		symbol: "♒︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "pisces",
		shortcut: '+',
		symbol: "♓︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "pluto",
		shortcut: '!', symbol: "♇", inlets: [], outlets: []
	},
	{
		name: "ceres",
		shortcut: '"', symbol: "⚳", inlets: [], outlets: []
	},
	{
		name: "pallas",
		shortcut: '£',
		symbol: "⚴",
		inlets: [],
		outlets: [],
	},
	{
		name: "juno",
		shortcut: '(', symbol: "⚵", inlets: [], outlets: []
	},
	{
		name: "vesta",
		shortcut: ')', symbol: "⚶", inlets: [], outlets: []
	},
	{
		name: "chiron",
		shortcut: '[',
		symbol: "⚷",
		inlets: [],
		outlets: [],
	},
	{
		name: "lilith",
		shortcut: '',
		symbol: "⚸",
		inlets: [],
		outlets: [],
	},
	{
		name: "sextile",
		shortcut: '*',
		symbol: "⚹",
		inlets: [0],
		outlets: [1, 2, 3, 4, 5],
		onMessage({ neighbourhood, send, data }) {
			this.glyph.outlets.forEach((outlet) => {
				send(neighbourhood[outlet], data);
			});
		},
	},
	{
		name: "semisextile",
		shortcut: '%',
		symbol: "⚺",
		inlets: [],
		outlets: [],
	},
	{
		name: "quincunx",
		shortcut: '^',
		symbol: "⚻",
		inlets: [],
		outlets: [],
	},
	{
		name: "sesquiquadrate",
		shortcut: '$',
		symbol: "⚼",
		inlets: [],
		outlets: [],
	},
];

let selectedHex: Hex | undefined = undefined

const cells = new Map<Hex, Cell>();

const Tile = defineHex({ dimensions: 30 });

const grid = new Grid(Tile, rectangle({ width: 47, height: 47 }));
const svg = SVG().addTo(space).size("100%", "100%");

const hexPolygonPoints = (hex: Hex): [number, number][] =>
	hex.corners.map(({ x, y }) => [x, y] as const);

grid.forEach((hex) => {
	const polygon = svg
		.polygon(hexPolygonPoints(hex))
		.stroke({ color: "black", width: 1, linejoin: "round" })
		.fill("transparent");

	cells.set(hex, { polygon, drawings: [], rotation: 0 });
});

function getEventHex(event: MouseEvent | WheelEvent) {
	if (space.classList.contains("pending")) {
		return;
	}

	event.stopImmediatePropagation();
	const x = event.clientX;
	const y = event.clientY;

	return grid.pointToHex({ x, y });
}

function setGlyph(hex: Hex, glyph?: Glyph) {
	const cell = cells.get(hex)!;

	if (cell.glyph) {
		cell.glyph.onEnd?.call({
			glyph: cell.glyph,
			hex,
			cell
		}, message(hex, null))
	}

	cell.glyph = glyph;

	cell.drawings.forEach(d => d.remove());

	if (glyph) {
		glyph.onInit?.call({
			glyph,
			hex,
			cell
		}, message(hex, null));

		cell.drawings.push(svg
			.text(glyph.symbol)
			.font({
				family: "monospace",
				anchor: "middle",
				size: "3em",
				leading: "3em",
				"dominant-baseline": "central",
			})
			.amove(hex.x, hex.y));

		glyph.inlets.forEach(i => {
			cell.drawings.push(svg
				.line([
					[hex.corners[i].x, hex.corners[i].y],
					[hex.corners[(i + 1) % 6].x, hex.corners[(i + 1) % 6].y],
				])
				.stroke({
					color: '#ff0000',
					width: 3
				}))
		})

		glyph.outlets.forEach(i => {
			cell.drawings.push(svg
				.line([
					[hex.corners[i].x, hex.corners[i].y],
					[hex.corners[(i + 1) % 6].x, hex.corners[(i + 1) % 6].y],
				])
				.stroke({
					color: '#0000ff',
					width: 3
				}))
		})
	}
}

function selectHex(event: MouseEvent) {
	const hex = getEventHex(event);
	if (!hex) return;

	cells.forEach(cell => {
		cell.polygon.stroke({
			color: "black", width: 1, linejoin: "round"
		})
	})

	const cell = cells.get(hex)
	if (!cell) return

	selectedHex = hex
	cell.polygon.stroke({
		color: "black", width: 6, linejoin: "round"
	})
}

function rotateSymbol(event: WheelEvent) {
	const hex = getEventHex(event);
	if (!hex) return;
	const cell = cells.get(hex);
	if (!cell?.glyph) return;

	const dir = Math.sign(event.deltaY);
	const index = glyphs.indexOf(cell.glyph);
	const glyph = glyphs[(index + dir + glyphs.length) % glyphs.length];
	setGlyph(hex, glyph);
}

function setCell(event: KeyboardEvent) {
	if (!selectedHex) return

	if (event.key === 'Backspace') {
		setGlyph(selectedHex, undefined)
	} else {
		const glyph = glyphs.find(g => g.shortcut === event.key)
		if (glyph) {
			setGlyph(selectedHex, glyph)
		}
	}
}

space.addEventListener("mousedown", selectHex);
space.addEventListener("wheel", rotateSymbol);
window.addEventListener('keydown', setCell)

space.addEventListener("click", async () => {
	if (space.classList.contains("pending")) {
		await Tone.start();
		Tone.getTransport().start();
		space.classList.remove("pending");
	}
});
