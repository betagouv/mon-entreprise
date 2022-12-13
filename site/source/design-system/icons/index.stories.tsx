import { ComponentMeta } from '@storybook/react'

import { SvgIcon } from '.'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: SvgIcon,
} as ComponentMeta<typeof SvgIcon>

export {
	CarretDownIcon,
	ChevronIcon,
	ErrorIcon,
	InfoIcon,
	ReturnIcon,
	SearchIcon,
	SuccessIcon,
} from '@/design-system/icons'
