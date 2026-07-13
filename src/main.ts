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
		symbol: "☉",
		onInit({ neighbourhood }) {
			this.loop = new Tone.Loop(() => {
				neighbourhood.forEach((hex) => {
					send(hex, null);
				});
			}, "4n").start("1m");
		},
		onEnd() {
			this.loop?.stop('1m')
		},
		inlets: [],
		outlets: [0, 1, 2, 3, 4, 5],
	}),
	{ name: "moon", symbol: "☽", inlets: [], outlets: [] },
	{ name: "earth", symbol: "♁", inlets: [], outlets: [] },
	{
		name: "mercury",
		symbol: "☿",
		inlets: [],
		outlets: [],
	},
	{ name: "venus", symbol: "♀", inlets: [], outlets: [] },
	{ name: "mars", symbol: "♂", inlets: [], outlets: [] },
	{
		name: "jupiter",
		symbol: "♃",
		inlets: [],
		outlets: [],
	},
	{
		name: "saturn",
		symbol: "♄",
		inlets: [],
		outlets: [],
	},
	{
		name: "uranus",
		symbol: "♅",
		inlets: [],
		outlets: [],
	},
	{
		name: "neptune",
		symbol: "♆",
		inlets: [],
		outlets: [],
	},
	{
		name: "conjunction",
		symbol: "☌",
		inlets: [],
		outlets: [],
	},
	{
		name: "opposition",
		symbol: "☍",
		inlets: [],
		outlets: [],
	},
	{
		name: "aries",
		symbol: "♈︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "taurus",
		symbol: "♉︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "gemini",
		symbol: "♊︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "cancer",
		symbol: "♋︎",
		inlets: [],
		outlets: [],
	},
	{ name: "leo", symbol: "♌︎", inlets: [], outlets: [] },
	{
		name: "virgo",
		symbol: "♍︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "libra",
		symbol: "♎︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "scorpio",
		symbol: "♏︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "sagittarius",
		symbol: "♐︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "capricorn",
		symbol: "♑︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "aquarius",
		symbol: "♒︎",
		inlets: [],
		outlets: [],
	},
	{
		name: "pisces",
		symbol: "♓︎",
		inlets: [],
		outlets: [],
	},
	{ name: "pluto", symbol: "♇", inlets: [], outlets: [] },
	{ name: "ceres", symbol: "⚳", inlets: [], outlets: [] },
	{
		name: "pallas",
		symbol: "⚴",
		inlets: [],
		outlets: [],
	},
	{ name: "juno", symbol: "⚵", inlets: [], outlets: [] },
	{ name: "vesta", symbol: "⚶", inlets: [], outlets: [] },
	{
		name: "chiron",
		symbol: "⚷",
		inlets: [],
		outlets: [],
	},
	{
		name: "lilith",
		symbol: "⚸",
		inlets: [],
		outlets: [],
	},
	{
		name: "sextile",
		symbol: "⚹",
		inlets: [],
		outlets: [],
		onMessage(ctx) {
			ctx.neighbourhood.forEach((hex) => {
				send(hex, ctx.data);
			});
		},
	},
	{
		name: "semisextile",
		symbol: "⚺",
		inlets: [],
		outlets: [],
	},
	{
		name: "quincunx",
		symbol: "⚻",
		inlets: [],
		outlets: [],
	},
	{
		name: "sesquiquadrate",
		symbol: "⚼",
		inlets: [],
		outlets: [],
	},
];

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

function setGlyph(hex: Hex, glyph: Glyph) {
	const cell = cells.get(hex)!;

	if (cell.glyph) {
		cell.glyph.onEnd?.({
			neighbourhood: neighbourhood(hex),
			self: hex
		})
	}

	glyph.data = glyph.onInit?.({
		neighbourhood: neighbourhood(hex),
		self: hex,
	});

	cell.glyph = glyph;

	cell.text?.remove();

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

function addSymbol(event: MouseEvent) {
	const hex = getEventHex(event);
	if (!hex) return;

	setGlyph(hex, glyphs[0]);
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

space.addEventListener("mousedown", addSymbol);
space.addEventListener("wheel", rotateSymbol);

space.addEventListener("click", async () => {
	if (space.classList.contains("pending")) {
		await Tone.start();
		Tone.getTransport().start();
		space.classList.remove("pending");
	}
});
