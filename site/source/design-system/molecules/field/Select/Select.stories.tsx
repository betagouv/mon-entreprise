import { Meta, StoryObj } from '@storybook/react'
import { Item } from 'react-stately'

import { Select } from '.'

const meta: Meta<typeof Select> = {
	component: Select,
}

export default meta

type Story = StoryObj<typeof Select>

export const Basic: Story = {
	render: () => (
		<Select value={2}>
			<Item textValue="Salut">Ça va ?</Item>
		</Select>
	),
	args: {},
}
