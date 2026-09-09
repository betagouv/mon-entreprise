import { ImmutableType } from '@/types/utils'

import { PageConfig } from './types'

export function config<Base extends ImmutableType<PageConfig>>(
	base: ImmutableType<PageConfig> & Base
) {
	return {
		[base.id]: base,
	} as ImmutableType<{ [k in Base['id']]: Base }>
}
