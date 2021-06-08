import HSLInterface from './HSLInterface';
import convert from 'color-convert';

/**
 * Class for manipulate HSL Color
 */

export default class HSL implements HSLInterface {
	a?: number;
	h = 0;
	l = 0;
	s = 0;

	constructor(color?: string | number[]) {
		if (color) {
			if (typeof color === 'string') {
				this.fromString(color);
			} else {
				this.fromArray(color);
			}
		}
	}

	/**
	 * Import hsl or hex from string
	 * @param color
	 */
	fromString(color: string) {
		return color.match(/hsl(a)?\(/) ? this.fromHsl(color) : this.fromHex(color)
	}

	/**
	 * import hsl from array
	 * @param color
	 */
	fromArray(color: number[]) {
		this.h = Number(color[0]) || 0;
		this.s = Number(color[1]) || 0;
		this.l = Number(color[2]) || 0;
		this.a = Number(color[3]) || undefined;
	}

	/**
	 * Import hsl from string
	 * @param color
	 */
	private fromHsl(color: string) {
		console.log('fromHsl : ', color)
		const arrayColor = color.match(/(\d+(\.\d+)?)+/g) || [];
		this.h = Number(arrayColor[0]) || 0;
		this.s = Number(arrayColor[1]) / 100 || 0;
		this.l = Number(arrayColor[2]) / 100 || 0;
		this.a = Number(arrayColor[3]) || undefined;
	}

	/**
	 * Import hex from string
	 * @param color
	 */
	private fromHex(color: string) {
		console.log('fromHex : ', color)
		const arrayColor = convert.hex.hsl(color);

		this.h = Number(arrayColor[0]) || 0;
		this.s = Number(arrayColor[1]) / 100 || 0;
		this.l = Number(arrayColor[2]) / 100 || 0;
	}

	/**
	 * Cast to string
	 * @returns
	 */
	toString(): string {
		const h = this.h.toFixed(2);
		const s = (this.s * 100).toFixed(2);
		const l = (this.l * 100).toFixed(2);
		const a = this.a?.toFixed(2);

		return this.a === undefined
			? `hsl(${h}, ${s}%, ${l}%)`
			: `hsla(${h}, ${s}%, ${l}%, ${a})`;
	}
}
