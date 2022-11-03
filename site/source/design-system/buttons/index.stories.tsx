import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from '@/design-system/buttons'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Button,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: { type: 'string' },
	},
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	size: 'XL',
	color: 'primary',
	children: 'Primary XL button',
}

export const Secondary = Template.bind({})
Secondary.args = {
	size: 'XS',
	color: 'secondary',
	children: 'Secondary XS button',
}
