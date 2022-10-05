type CamelCase<S extends string> =
	S extends `${infer P1}_${infer P2}${infer P3}`
		? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
		: Lowercase<S>

const snakeToCamelCase = <T extends string>(str: T) =>
	str
		.replace(/_/g, ' ')
		.replace(/(?<!\p{L})\p{L}|\s+/gu, (m) => (+m === 0 ? '' : m.toUpperCase()))
		.replace(/^./, (m) => m?.toLowerCase()) as CamelCase<T>

export type KeysToCamelCase<T> = {
	[K in keyof T as CamelCase<string & K>]: T[K]
}

export const snakeToCamelCaseKeys = <T extends object>(object: T) =>
	Object.fromEntries(
		Object.entries(object).map(
			([key, value]) => [snakeToCamelCase(key), value],
			{}
		)
	) as KeysToCamelCase<T>

export const shuffleArray = <T>(array: T[]) => {
	const shuffle = [...array]

	for (let i = shuffle.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const [shuffleI, shuffleJ] = [shuffle[i], shuffle[j]]
		shuffle[i] = shuffleJ
		shuffle[j] = shuffleI
	}

	return shuffle
}
