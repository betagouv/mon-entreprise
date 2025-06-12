import { Meta, StoryObj } from '@storybook/react'

import { Radio, ToggleGroup } from '.'

const meta: Meta<typeof ToggleGroup> = {
	component: ToggleGroup,
}

export default meta

type Story = StoryObj<typeof ToggleGroup>

export const Basic: Story = {
	render: (args) => (
		<ToggleGroup {...args}>
			<Radio value="valueA">Radio A</Radio>
			<Radio value="valueB">Radio B</Radio>
			<Radio value="valueC">Radio C</Radio>
			<Radio isDisabled value="valueD">
				Radio Disabled
			</Radio>
		</ToggleGroup>
	),
	args: {},
}

export const ValeurParDéfaut: Story = {
	render: (args) => (
		<ToggleGroup defaultValue="valueB" {...args}>
			<Radio value="valueA">Radio A</Radio>
			<Radio value="valueB" defaultSelected={true}>
				Radio B
			</Radio>
			<Radio value="valueC">Radio C</Radio>
			<Radio isDisabled value="valueD">
				Radio Disabled
			</Radio>
		</ToggleGroup>
	),
	args: {},
}
