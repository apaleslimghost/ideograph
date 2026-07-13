import { defineHex, Grid, type Hex, rectangle, ring } from "honeycomb-grid";
import "./index.css";
import { type Polygon, SVG, type Text } from "@svgdotjs/svg.js";
import * as Tone from "tone";

const space = document.querySelector<HTMLDivElement>("#space")!;

type Context<T> = {
	neighbourhood: Hex[];
	self: Hex;
	data?: T;
};

function neighbourhood(hex: Hex): Hex[] {
	return Array.from(grid.traverse(ring({ center: hex, radius: 1 })));
}

function send<T>(target: Hex, data: T) {
	const cell = cells.get(target);
	const context: Context<T> = {
		neighbourhood: neighbourhood(target),
		self: target,
		data,
	};

	cell?.polygon
		.fill(cell.glyph ? "#CE93D8" : "#F3E5F5")
		.animate(200)
		.fill("#ffffff");

	if (cell?.glyph) {
		cell.glyph.onMessage?.(context);
	}
}

type Glyph<R extends object = Record<string, unknown>> = {
	name: string;
	shortcut: string;
	symbol: string;
	onMessage?: <T>(this: Glyph<R>, context: Context<T>) => void;
	onInit?: <T>(this: Glyph<R>, context: Context<T>) => void;
	onEnd?: <T>(this: Glyph<R>, context: Context<T>) => void;
	inlets: HexSide[];
	outlets: HexSide[];
} & R;

type HexSide = 0 | 1 | 2 | 3 | 4 | 5;

type Cell = {
	polygon: Polygon;
	text?: Text;
	glyph?: Glyph;
	rotation: HexSide;
};

const glyph = <R extends object>(g: Glyph<R>) => g

const glyphs: Glyph[] = [
	glyph<{ loop?: Tone.Loop }>({
		name: "sun",
		shortcut: 's',
		symbol: "☉",
		onInit({ neighbourhood }) {
			this.loop = new Tone.Loop(() => {
				neighbourhood.forEach((hex) => {
					send(hex, null);
				});
			}, "4n").start("1m");
		},
		onEnd() {
			console.log(this.loop)
			this.loop?.stop('1m')
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
		onMessage(ctx) {
			this.outlets.forEach((outlet) => {
				send(ctx.neighbourhood[outlet], ctx.data);
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
		.stroke({ color: "black", width: 3, linejoin: "round" })
		.fill("#ffffff");

	cells.set(hex, { polygon, rotation: 0 });
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
		cell.glyph.onEnd?.({
			neighbourhood: neighbourhood(hex),
			self: hex
		})
	}

	cell.glyph = glyph;

	cell.text?.remove();

	if (glyph) {
		glyph.data = glyph.onInit?.({
			neighbourhood: neighbourhood(hex),
			self: hex,
		});

		const text = svg
			.text(glyph.symbol)
			.font({
				family: "monospace",
				anchor: "middle",
				size: "3em",
				leading: "3em",
				"dominant-baseline": "central",
			})
			.amove(hex.x, hex.y);

		cell.text = text;
	}
}

function selectHex(event: MouseEvent) {
	const hex = getEventHex(event);
	if (!hex) return;

	cells.forEach(cell => {
		cell.polygon.stroke({
			color: "black", width: 3, linejoin: "round"
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
