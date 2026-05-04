import { defineHex, Grid, type Hex, rectangle } from "honeycomb-grid";
import "./index.css";
import { SVG } from "@svgdotjs/svg.js";

const space = document.querySelector<HTMLDivElement>("#space")!;

const symbols = [
	"☉", // sun
	"☽", // moon
	"☿", // mercury
	"♀", // venus
	"♂", // mars
	"♃", // jupiter
	"♄", // saturn
	"♅", // uranus
	"♆", // neptune
	"☌", // conjunction
	"☍", // opposition
	"♈︎", // aries
	"♉︎", // taurus
	"♊︎", // gemini
	"♋︎", // cancer
	"♌︎", // leo
	"♍︎", // virgo
	"♎︎", // libra
	"♏︎", // scorpio
	"♐︎", // sagittarius
	"♑︎", // capricorn
	"♒︎", // aquarius
	"♓︎", // pisces
	"♇", // pluto
	"⚳", // ceres
	"⚴", // pallas
	"⚵", // juno
	"⚶", // vesta
	"⚷", // chiron
	"⚸", // lilith
	"⚹", // sextile
	"⚺", // semisextile
	"⚻", // quincunx
	"⚼", // sesquiquadrate
];

const Tile = defineHex({ dimensions: 30 });
const grid = new Grid(Tile, rectangle({ width: 47, height: 47 }));
const svg = SVG().addTo(space).size("100%", "100%");

const hexPolygonPoints = (hex: Hex): [number, number][] =>
	hex.corners.map(({ x, y }) => [x, y] as const);

grid.forEach((hex) => {
	svg.polygon(hexPolygonPoints(hex)).stroke({ color: "black" }).fill("none");
});

function addSymbol(event: MouseEvent) {
	event.stopImmediatePropagation();
	const x = event.clientX;
	const y = event.clientY;

	const gridPosition = grid.pointToHex({ x, y });

	const e = symbols[Math.floor(Math.random() * symbols.length)];

	svg.text(e)
		.font({
			family: "monospace",
			anchor: "middle",
			size: "3em",
			leading: "3em",
			"dominant-baseline": "central",
		})
		.amove(gridPosition.x, gridPosition.y);
}

space.addEventListener("mousedown", addSymbol);
