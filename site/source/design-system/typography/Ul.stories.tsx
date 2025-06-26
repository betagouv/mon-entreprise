import { Meta, StoryObj } from '@storybook/react'

import { Li, Ul } from '@/design-system/typography/list'

const meta: Meta<typeof Ul> = {
	component: Ul,
}

export default meta

type StoryUl = StoryObj<typeof Ul>

export const Basic: StoryUl = {
	render: (args) => (
		<Ul {...args}>
			<Li>Élément 1</Li>
			<Li>Élément 2</Li>
			<Li>Élément 3</Li>
		</Ul>
	),
}

export const Xl: StoryUl = {
	render: (args) => (
		<Ul {...args}>
			<Li>Élément 1</Li>
			<Li>Élément 2</Li>
			<Li>Élément 3</Li>
		</Ul>
	),
	args: {
		size: 'XL',
	},
}
