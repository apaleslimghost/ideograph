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

	if (cell?.glyph) {
		cell.polygon.fill("#EA80FC").animate(100).fill("#ffffff");
		cell.glyph.onMessage?.(context);
	}
}

type Glyph = {
	name: string;
	symbol: string;
	onMessage?: <T>(context: Context<T>) => void;
	onInit?: <T>(context: Context<T>) => void;
	inlets: HexSide[];
	outlets: HexSide[];
};

type HexSide = 0 | 1 | 2 | 3 | 4 | 5;

type Cell = {
	polygon: Polygon;
	text?: Text;
	glyph?: Glyph;
	rotation: HexSide;
};

const glyphs: Glyph[] = [
	{
		name: "sun",
		symbol: "☉",
		onInit: ({ neighbourhood }) => {
			new Tone.Loop(() => {
				neighbourhood.forEach((hex) => {
					send(hex, null);
				});
			}, "4n").start("1m");
		},
		inlets: [],
		outlets: [0, 1, 2, 3, 4, 5],
	},
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

function addSymbol(event: MouseEvent) {
	if (space.classList.contains("pending")) {
		return;
	}

	event.stopImmediatePropagation();
	const x = event.clientX;
	const y = event.clientY;

	const hex = grid.pointToHex({ x, y });
	const cell = cells.get(hex)!;

	const glyph = glyphs[0];
	glyph.onInit?.({
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

space.addEventListener("mousedown", addSymbol);

space.addEventListener("click", async () => {
	if (space.classList.contains("pending")) {
		await Tone.start();
		Tone.getTransport().start();
		space.classList.remove("pending");
	}
});
