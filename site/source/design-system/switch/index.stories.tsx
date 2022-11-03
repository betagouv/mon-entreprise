import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Switch } from '@/design-system/switch'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Switch,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: {
			type: 'string',
		},
	},
} as ComponentMeta<typeof Switch>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {
	children: 'Label',
}

export const Selected = Template.bind({})
Selected.args = {
	isSelected: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
	isDisabled: true,
}
