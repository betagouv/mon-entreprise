/**
 * Immutable type
 *
 * source: https://github.com/cefn/lauf/blob/b982a09/modules/store/src/types/immutable.ts#L25
 */
export type ImmutableType<T> = T extends (...args: unknown[]) => unknown
	? T
	: T extends object
	? ImmutableIndex<T>
	: T

type ImmutableIndex<T> = Readonly<{
	[K in keyof T]: ImmutableType<T[K]>
}>

/**
 * Merge union of object
 *
 * Example: `Merge<{a: number, b: string} | {a: string, c: string}>` type gives
 * `{a: string | number; b: string | undefined; c: string | undefined;}`
 */
export type Merge<T extends object> = {
	[k in AllKeys<T>]: PickTypeOf<T, k>
}

type AllKeys<T> = T extends unknown ? keyof T : never

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]: unknown }
	? T[K]
	: undefined

type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
	? PickType<T, K>
	: never

/**
 * Transform undefined value of an object to optional value
 *
 * Example: `ToOptional<{a: number, b: string | undefined}>` type gives `{a: number; b?: string;}`
 */
export type ToOptional<T> = Partial<Pick<T, UndefinedProperties<T>>> &
	Pick<T, Exclude<keyof T, UndefinedProperties<T>>>

type UndefinedProperties<T> = {
	[P in keyof T]-?: undefined extends T[P] ? P : never
}[keyof T]
