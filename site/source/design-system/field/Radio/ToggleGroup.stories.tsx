import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Radio, ToggleGroup } from '.'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: ToggleGroup,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	// argTypes: {
	// },
} as ComponentMeta<typeof ToggleGroup>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToggleGroup> = (args) => (
	<ToggleGroup {...args}>
		<Radio value="valueA">Radio A</Radio>
		<Radio value="valueB">Radio B</Radio>
		<Radio value="valueC">Radio C</Radio>
	</ToggleGroup>
)

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {}
