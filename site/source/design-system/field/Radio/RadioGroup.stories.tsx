import { Meta, StoryObj } from '@storybook/react'

import { Radio, RadioGroup } from '.'

const meta: Meta<typeof RadioGroup> = {
	component: RadioGroup,
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Basic: Story = {
	render: (args) => (
		<RadioGroup {...args}>
			<Radio value="valueA">Radio A</Radio>
			<Radio value="valueB">Radio B</Radio>
			<Radio value="valueC">Radio C</Radio>
		</RadioGroup>
	),
	args: {},
}
