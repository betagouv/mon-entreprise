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

export const Couleurs: Story = {
	render: () => (
		<>
			<Chip type="primary">Primary</Chip>
			<Chip type="secondary">Secondary</Chip>
			<Chip type="error">Error</Chip>
			<Chip type="info">Info</Chip>
			<Chip type="success">Success</Chip>
		</>
	),
}

export const Icones: Story = {
	render: () => (
		<>
			<Chip type="error" icon>
				Error
			</Chip>
			<Chip type="info" icon>
				Info
			</Chip>
			<Chip type="success" icon>
				Success
			</Chip>
		</>
	),
}

export const IconesPersonnalisées: Story = {
	render: () => (
		<>
			<Chip icon={<Emoji emoji="🚧" />} type="info">
				Bêta
			</Chip>
			<Chip type="secondary" icon={<Emoji emoji="😃" />}>
				Everything is awesome
			</Chip>
		</>
	),
}
