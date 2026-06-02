import { Decorator, Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MemoryRouter } from 'react-router-dom'

import { ChoixMultiple } from './ChoixMultiple'

const RouterDecorator: Decorator = (Story) => (
	<MemoryRouter>
		<Story />
	</MemoryRouter>
)

const meta = {
	component: ChoixMultiple,
	args: {
		onChange: fn(),
	},
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	decorators: [RouterDecorator],
} satisfies Meta<typeof ChoixMultiple>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		options: [
			{
				id: 'option1',
				value: false,
				label: 'Option 1',
			},
			{
				id: 'option2',
				value: true,
				label: 'Option 2',
			},
			{
				id: 'option3',
				value: false,
				label: 'Option 3',
			},
		],
	},
}

export const WithDescription: Story = {
	args: {
		options: [
			{
				id: 'option1',
				value: false,
				label: 'Option 1',
				description: "Description de l'option 1",
			},
			{
				id: 'option2',
				value: true,
				label: 'Option 2',
				description: "Description de l'option 2",
			},
			{
				id: 'option3',
				value: false,
				label: 'Option 3',
				description: "Description de l'option 3",
			},
		],
	},
}

export const WithEmoji: Story = {
	args: {
		options: [
			{
				id: 'option1',
				value: false,
				label: 'Option 1',
				emoji: '🚀',
			},
			{
				id: 'option2',
				value: true,
				label: 'Option 2',
				emoji: '🎯',
			},
			{
				id: 'option3',
				value: false,
				label: 'Option 3',
				emoji: '🔍',
			},
		],
	},
}

export const WithEmojiAndDescription: Story = {
	args: {
		options: [
			{
				id: 'option1',
				value: false,
				label: 'Option 1',
				emoji: '🚀',
				description: "Description de l'option 1",
			},
			{
				id: 'option2',
				value: true,
				label: 'Option 2',
				emoji: '🎯',
				description: "Description de l'option 2",
			},
			{
				id: 'option3',
				value: false,
				label: 'Option 3',
				emoji: '🔍',
				description: "Description de l'option 3",
			},
		],
	},
}
