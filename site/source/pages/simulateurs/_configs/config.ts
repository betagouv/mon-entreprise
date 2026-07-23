import { ImmutableType } from '@/types/utils'

import { PageMetadata } from './types'

/**
 * Indexe des métadonnées par leur id, pour composer l'agrégat `{ [id]: … }`
 */
export function parId<Base extends ImmutableType<PageMetadata>>(
	base: ImmutableType<PageMetadata> & Base
) {
	return {
		[base.id]: base,
	} as ImmutableType<{ [k in Base['id']]: Base }>
}
