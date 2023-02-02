import { ImmutableType } from '@/types/utils'

import { PageConfig } from './types'

// Replace type by commented line when we upgrade to typescript v5:
export function config<
	// const	Base extends ImmutableType<PageConfig>
	Base extends ImmutableType<PageConfig>
>(base: ImmutableType<PageConfig> & Base) {
	return {
		[base.id]: base,
	} as ImmutableType<{ [k in Base['id']]: Base }>
}
