import { Meta, StoryObj } from '@storybook/react'

import { Li, Ol } from '@/design-system/typography/list'

const meta: Meta<typeof Ol> = {
	component: Ol,
}

export default meta

type Story = StoryObj<typeof Ol>

export const Numbered: Story = {
	render: (args) => (
		<Ol {...args}>
			<Li>Élément 1</Li>
			<Li>Élément 2</Li>
			<Li>Élément 3</Li>
		</Ol>
	),
}
