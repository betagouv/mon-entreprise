import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Drawer } from '@/design-system/drawer'

import { Button } from '../buttons'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Drawer,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: {
			type: 'string',
		},
		trigger: {
			type: 'string',
		},
	},
} as ComponentMeta<typeof Drawer>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Drawer> = (args) => <Drawer {...args} />

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {
	children: 'Coucou !',
	trigger: <Button>Ouvrir le tiroir</Button>,
}
