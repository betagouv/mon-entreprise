import { ImmutableType } from '@/types/utils'

import { PageConfig, PageMetadata } from './types'

/**
 * Indexe des métadonnées (ou une config) par leur id,
 * pour composer les agrégats `{ [id]: … }`
 */
export function parId<Base extends ImmutableType<PageMetadata>>(
	base: ImmutableType<PageMetadata> & Base
) {
	return {
		[base.id]: base,
	} as ImmutableType<{ [k in Base['id']]: Base }>
}

export function config<Base extends ImmutableType<PageConfig>>(
	base: ImmutableType<PageConfig> & Base
) {
	return parId<Base>(base)
}
