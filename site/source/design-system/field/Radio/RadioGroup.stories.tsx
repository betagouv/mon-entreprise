import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Radio, RadioGroup } from '.'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: RadioGroup,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	// argTypes: {
	// },
} as ComponentMeta<typeof RadioGroup>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RadioGroup> = (args) => (
	<RadioGroup {...args}>
		<Radio value="valueA">Radio A</Radio>
		<Radio value="valueB">Radio B</Radio>
		<Radio value="valueC">Radio C</Radio>
	</RadioGroup>
)

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {}
