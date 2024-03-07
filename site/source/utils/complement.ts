type Not<B extends boolean> = B extends true ? false : true

export const complement =
	<A extends unknown[], B extends boolean>(f: (...args: A) => B) =>
	(...args: A) =>
		!f(...args) as Not<B>
