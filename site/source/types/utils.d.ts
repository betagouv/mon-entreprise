// Immutable type
// source: https://github.com/cefn/lauf/blob/b982a09/modules/store/src/types/immutable.ts#L25
export type ImmutableType<T> = T extends (...args: unknown[]) => unknown
	? T
	: T extends object
	? ImmutableIndex<T>
	: T

type ImmutableIndex<T> = Readonly<{
	[K in keyof T]: ImmutableType<T[K]>
}>
