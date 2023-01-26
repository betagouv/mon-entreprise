import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Tooltip } from '@/design-system/tooltip'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Tooltip,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: {
			type: 'string',
		},
		tooltip: {
			type: 'string',
		},
		id: {
			type: 'string',
		},
	},
} as ComponentMeta<typeof Tooltip>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {
	children: 'Passez la souris sur moi',
	tooltip: 'Coucou !',
	id: 'test-tooltip',
}
