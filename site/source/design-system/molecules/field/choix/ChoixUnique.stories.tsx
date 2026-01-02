import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { ChoixUnique } from './ChoixUnique'

const RouterDecorator = (Story: StoryFn) => (
	<MemoryRouter>
		<Story />
	</MemoryRouter>
)

const meta = {
	component: ChoixUnique,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		onChange: { action: 'changed' },
		variant: {
			control: 'select',
			options: ['radio', 'card', 'toggle', 'select'],
		},
	},
	decorators: [RouterDecorator],
} satisfies Meta<typeof ChoixUnique>

export default meta
type Story = StoryObj<typeof meta>

const defaultOptions = [
	{
		value: 'option1',
		label: 'Option 1',
	},
	{
		value: 'option2',
		label: 'Option 2',
	},
	{
		value: 'option3',
		label: 'Option 3',
	},
]

export const RadioDefault: Story = {
	args: {
		options: defaultOptions,
		variant: 'radio',
	},
}

export const RadioWithDefaultValue: Story = {
	args: {
		options: defaultOptions,
		variant: 'radio',
		defaultValue: 'option2',
	},
}

export const RadioWithDescription: Story = {
	args: {
		options: [
			{
				value: 'option1',
				label: 'Option 1',
				description: "Description de l'option 1",
			},
			{
				value: 'option2',
				label: 'Option 2',
				description: "Description de l'option 2",
			},
			{
				value: 'option3',
				label: 'Option 3',
				description: "Description de l'option 3",
			},
		],
		variant: 'radio',
	},
}

export const RadioWithEmoji: Story = {
	args: {
		options: [
			{
				value: 'option1',
				label: 'Option 1',
				emoji: '🚀',
			},
			{
				value: 'option2',
				label: 'Option 2',
				emoji: '🎯',
			},
			{
				value: 'option3',
				label: 'Option 3',
				emoji: '🔍',
			},
		],
		variant: 'radio',
	},
}

export const CardVariant: Story = {
	args: {
		options: [
			{
				value: 'option1',
				label: 'Option 1',
				emoji: '🚀',
				description: "Description de l'option 1",
			},
			{
				value: 'option2',
				label: 'Option 2',
				emoji: '🎯',
				description: "Description de l'option 2",
			},
			{
				value: 'option3',
				label: 'Option 3',
				emoji: '🔍',
				description: "Description de l'option 3",
			},
		],
		variant: 'card',
	},
}

export const ToggleVariant: Story = {
	args: {
		options: [
			{
				value: 'option1',
				label: 'Option 1',
			},
			{
				value: 'option2',
				label: 'Option 2',
			},
		],
		variant: 'toggle',
	},
}

export const SelectVariant: Story = {
	args: {
		options: [
			{
				value: 'option1',
				label: 'Option 1',
			},
			{
				value: 'option2',
				label: 'Option 2',
			},
			{
				value: 'option3',
				label: 'Option 3',
			},
			{
				value: 'option4',
				label: 'Option 4',
			},
			{
				value: 'option5',
				label: 'Option 5',
			},
		],
		variant: 'select',
	},
}

export const WithIsDefaultSelected: Story = {
	args: {
		options: [
			{
				value: 'option1',
				label: 'Option 1',
			},
			{
				value: 'option2',
				label: 'Option 2',
				isDefaultSelected: true,
			},
			{
				value: 'option3',
				label: 'Option 3',
			},
		],
		variant: 'radio',
	},
}
