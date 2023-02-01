import { lazy } from 'react'

import { PageConfig } from '../configs/types'
import { SimulatorsDataParams } from '../metadata'

// Replace type by commented line when we upgrade to typescript v5:
export const configCoûtCréationEntreprise = function <
	// const Merge extends Partial<Immutable<PageConfig>>[]
	Merge extends Partial<Immutable<PageConfig>>[]
>(
	{ t, sitePaths }: Pick<SimulatorsDataParams, 't' | 'sitePaths'>,
	...merge: [...Merge]
) {
	const ret = config(
		'coût-création-entreprise',
		{
			beta: true,
			path: sitePaths.simulateurs['coût-création-entreprise'],
			iframePath: 'coût-création-entreprise',
			icône: '💰',
			tracking: 'cout_création_entreprise',
			pathId: 'simulateurs.coût-création-entreprise',
			meta: {
				title: t(
					'pages.simulateurs.coût-création-entreprise.meta.title',
					"Coût de création d'une entreprise"
				),
				description: t(
					'pages.simulateurs.coût-création-entreprise.meta.description',
					"Estimer les coûts lors de la création d'une entreprise"
				),
			},
			shortName: t(
				'pages.simulateurs.coût-création-entreprise.shortName',
				"Coût de création d'une entreprise"
			),
			title: t(
				'pages.simulateurs.coût-création-entreprise.title',
				"Simulateur du coût de création d'une entreprise"
			),
			simulation: {
				'objectifs exclusifs': [],
				objectifs: ['entreprise . coût formalités . création'],
				questions: {
					'liste noire': ['entreprise . activité . nature'],
				},
				situation: {},
			},
			lazyComponent: lazy(async () => await import('.')),

			// Remove this "as const" when we upgrade to typescript v5:
		} as const,
		...merge
	)

	return ret
}

// Replace type by commented line when we upgrade to typescript v5:
const config = function <
	// const	Id extends string,
	Key extends string,
	// const	Base extends Immutable<PageConfig>
	Base extends Immutable<PageConfig>,
	// const Merge extends Partial<Immutable<PageConfig>>[]
	Merge extends Partial<Immutable<PageConfig>>[]
>(id: Key, base: Base, ...merge: [...Merge]) {
	return {
		[id]: Object.assign({}, base, ...merge) as unknown,
	} as Immutable<{ [k in Key]: Spread<Base, SpreadArray<Merge>> }>
}

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

// Immutable type
// source: https://github.com/cefn/lauf/blob/b982a09/modules/store/src/types/immutable.ts#L25
export type Immutable<T> = T extends (...args: unknown[]) => unknown
	? T
	: T extends object
	? ImmutableIndex<T>
	: T

type ImmutableIndex<T> = Readonly<{
	[K in keyof T]: Immutable<T[K]>
}>

// Spread type:
// source: https://github.com/microsoft/TypeScript/issues/10727#issuecomment-725654378
type Spread<L, R> = Id<
	Pick<L, Exclude<keyof L, keyof R>> &
		Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
		Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
		SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpreadArray<A extends readonly [...any]> = A extends [infer L, ...infer R]
	? Spread<L, SpreadArray<R>>
	: unknown

type OptionalPropertyNames<T> = {
	[K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
	[P in K]: L[P] | Exclude<R[P], undefined>
}

type Id<T> = { [K in keyof T]: T[K] }
