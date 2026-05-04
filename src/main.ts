import { defineHex, Grid, type Hex, rectangle } from "honeycomb-grid";
import "./index.css";
import { type Polygon, SVG, type Text } from "@svgdotjs/svg.js";

const space = document.querySelector<HTMLDivElement>("#space")!;

type Context = {
	neighbourhood: [Hex, Hex, Hex, Hex, Hex, Hex];
	self: Hex;
};

type Glyph = {
	name: string;
	symbol: string;
	onMessage: (context: Context) => void;
};

type Cell = {
	polygon: Polygon;
	text?: Text;
	glyph?: Glyph;
};

const glyphs: Glyph[] = [
	{ name: "sun", symbol: "☉", onMessage: () => {} },
	{ name: "moon", symbol: "☽", onMessage: () => {} },
	{ name: "mercury", symbol: "☿", onMessage: () => {} },
	{ name: "venus", symbol: "♀", onMessage: () => {} },
	{ name: "mars", symbol: "♂", onMessage: () => {} },
	{ name: "jupiter", symbol: "♃", onMessage: () => {} },
	{ name: "saturn", symbol: "♄", onMessage: () => {} },
	{ name: "uranus", symbol: "♅", onMessage: () => {} },
	{ name: "neptune", symbol: "♆", onMessage: () => {} },
	{ name: "conjunction", symbol: "☌", onMessage: () => {} },
	{ name: "opposition", symbol: "☍", onMessage: () => {} },
	{ name: "aries", symbol: "♈︎", onMessage: () => {} },
	{ name: "taurus", symbol: "♉︎", onMessage: () => {} },
	{ name: "gemini", symbol: "♊︎", onMessage: () => {} },
	{ name: "cancer", symbol: "♋︎", onMessage: () => {} },
	{ name: "leo", symbol: "♌︎", onMessage: () => {} },
	{ name: "virgo", symbol: "♍︎", onMessage: () => {} },
	{ name: "libra", symbol: "♎︎", onMessage: () => {} },
	{ name: "scorpio", symbol: "♏︎", onMessage: () => {} },
	{ name: "sagittarius", symbol: "♐︎", onMessage: () => {} },
	{ name: "capricorn", symbol: "♑︎", onMessage: () => {} },
	{ name: "aquarius", symbol: "♒︎", onMessage: () => {} },
	{ name: "pisces", symbol: "♓︎", onMessage: () => {} },
	{ name: "pluto", symbol: "♇", onMessage: () => {} },
	{ name: "ceres", symbol: "⚳", onMessage: () => {} },
	{ name: "pallas", symbol: "⚴", onMessage: () => {} },
	{ name: "juno", symbol: "⚵", onMessage: () => {} },
	{ name: "vesta", symbol: "⚶", onMessage: () => {} },
	{ name: "chiron", symbol: "⚷", onMessage: () => {} },
	{ name: "lilith", symbol: "⚸", onMessage: () => {} },
	{ name: "sextile", symbol: "⚹", onMessage: () => {} },
	{ name: "semisextile", symbol: "⚺", onMessage: () => {} },
	{ name: "quincunx", symbol: "⚻", onMessage: () => {} },
	{ name: "sesquiquadrate", symbol: "⚼", onMessage: () => {} },
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
		.stroke({ color: "black" })
		.fill("none");

	cells.set(hex, { polygon });
});

function addSymbol(event: MouseEvent) {
	event.stopImmediatePropagation();
	const x = event.clientX;
	const y = event.clientY;

	const hex = grid.pointToHex({ x, y });
	const cell = cells.get(hex)!;

	const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
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
