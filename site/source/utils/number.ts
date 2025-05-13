export const round = (number: number, precision = 0) =>
	Math.round(number * 10 ** precision) / 10 ** precision
