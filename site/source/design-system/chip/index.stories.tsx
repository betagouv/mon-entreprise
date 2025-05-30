import { Meta, StoryObj } from '@storybook/react'

import { Emoji } from '../emoji'
import { Chip } from './'

const meta: Meta<typeof Chip> = {
	component: Chip,
	argTypes: {
		children: { type: 'string' },
	},
}

export default meta

type Story = StoryObj<typeof Chip>

export const Notification: Story = {
	args: {
		children: '4',
		type: 'info',
	},
}

export const DifferentChips: Story = {
	render: (args) => (
		<>
			<Chip {...args} type="error">
				Panique !
			</Chip>
			<Chip {...args} type="info">
				Attention
			</Chip>
			<Chip {...args} type="success">
				Ouiiiiiii
			</Chip>
			<Chip {...args} type="primary">
				4 messages non lus
			</Chip>
			<Chip {...args} type="secondary">
				SASU
			</Chip>
		</>
	),
	args: {
		icon: true,
	},
}

export const ChipWithCustomIcon: Story = {
	render: (args) => (
		<>
			<Chip {...args} icon={<Emoji emoji="🚧" />} type="info">
				Bêta
			</Chip>
			<Chip {...args} type="secondary" icon={<Emoji emoji="😃" />}>
				Everything is awesome
			</Chip>
		</>
	),
	args: {},
}
