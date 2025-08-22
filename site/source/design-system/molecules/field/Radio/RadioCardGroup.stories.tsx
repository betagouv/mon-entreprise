import { Meta, StoryObj } from '@storybook/react'

import { RadioCard, RadioCardGroup } from '.'
import { RadioCardSkeleton } from './RadioCard'

const meta: Meta<typeof RadioCardGroup> = {
	component: RadioCardGroup,
	argTypes: {
		label: {
			type: 'string',
		},
	},
}

export default meta

type Story = StoryObj<typeof RadioCardGroup>

export const Basic: Story = {
	render: (args) => (
		<RadioCardGroup {...args}>
			<RadioCard
				value="valueA"
				label="Title A"
				description={'ceci est une description'}
			/>
			<RadioCard
				value="valueB"
				label="Title B"
				description={'ceci est une description'}
			/>
			<RadioCard value="valueC" label="Title C" />
			<RadioCard isDisabled value="valueD" label="RadioCard disabled" />
		</RadioCardGroup>
	),
	args: {},
}

export const Custom: Story = {
	render: (args) => (
		<RadioCardGroup {...args}>
			<RadioCardSkeleton value="value1">
				<p>Custom content without radio point</p>
			</RadioCardSkeleton>
			<RadioCardSkeleton value="value2">
				<p>Value 2</p>
				<p>Second paragraph</p>
			</RadioCardSkeleton>
			<RadioCardSkeleton value="value3">
				<p>Value 3</p>
			</RadioCardSkeleton>
			<RadioCardSkeleton isDisabled value="value4">
				<p>RadioCard disabled</p>
			</RadioCardSkeleton>
		</RadioCardGroup>
	),
	args: {},
}
