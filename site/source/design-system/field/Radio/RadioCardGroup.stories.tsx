import { Meta, StoryObj } from '@storybook/react'

import { RadioCard, RadioCardGroup } from '.'

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
				label={'Title A'}
				description={'ceci est une description'}
			/>
			<RadioCard
				value="valueB"
				label={'Title B'}
				description={'ceci est une description'}
			/>
			<RadioCard value="valueC" label={'Title C'} />
			<RadioCard
				hideRadio
				value="valueD"
				label={'Title D'}
				description="hidden radio"
			/>
		</RadioCardGroup>
	),
	args: {},
}
