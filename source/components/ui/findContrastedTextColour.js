/* Given a backgorund color, should you write on it in black or white ?
 Taken from http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color#comment61936401_3943023
*/

export default function(color, simple) {
	let r = hexToR(color),
		g = hexToG(color),
		b = hexToB(color)

	if (simple) {
		// The YIQ formula
		return r * 0.299 + g * 0.587 + b * 0.114 > 128 ? '#000000' : '#ffffff'
	} // else complex formula
	let uicolors = [r / 255, g / 255, b / 255],
		c = uicolors.map(
			c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
		),
		L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

	return L > 0.179 ? '#000000' : '#ffffff'
}

/* Hex to RGB conversion:
 * http://www.javascripter.net/faq/hextorgb.htm
 */
let cutHex = h => (h.charAt(0) == '#' ? h.substring(1, 7) : h),
	hexToR = h => parseInt(cutHex(h).substring(0, 2), 16),
	hexToG = h => parseInt(cutHex(h).substring(2, 4), 16),
	hexToB = h => parseInt(cutHex(h).substring(4, 6), 16)
