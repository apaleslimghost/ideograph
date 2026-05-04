import { defineHex, Grid, type Hex, rectangle } from "honeycomb-grid";
import "./index.css";
import { SVG } from "@svgdotjs/svg.js";
import * as emoji from "node-emoji";

const space = document.querySelector<HTMLDivElement>("#space")!;

type Emoji = {
	emoji: string;
	x: number;
	y: number;
	element: HTMLElement;
	connections?: number[];
};

const emojis: Emoji[] = [];

const Tile = defineHex({ dimensions: 30 });
const grid = new Grid(Tile, rectangle({ width: 47, height: 47 }));
const svg = SVG().addTo(space).size("100%", "100%");

const hexPolygonPoints = (hex: Hex): [number, number][] =>
	hex.corners.map(({ x, y }) => [x, y] as const);

grid.forEach((hex) => {
	svg.polygon(hexPolygonPoints(hex)).stroke({ color: "black" }).fill("none");
});

function addEmoji(event: MouseEvent) {
	event.stopImmediatePropagation();
	const x = event.clientX;
	const y = event.clientY;

	const gridPosition = grid.pointToHex({ x, y });

	const e = emoji.random().emoji;

	const el = document.createElement("div");
	el.classList.add("emoji");
	el.innerHTML = e;

	const index = emojis.push({
		emoji: e,
		x: gridPosition.x,
		y: gridPosition.y,
		element: el,
	});

	el.style.translate = `${gridPosition.x}px ${gridPosition.y}px`;
	el.dataset.index = (index - 1).toString();

	space.append(el);
}

space.addEventListener("mousedown", addEmoji);
