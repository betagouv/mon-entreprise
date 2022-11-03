import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadioCard, RadioCardGroup } from '.'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: RadioCardGroup,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		label: {
			type: 'string',
		},
	},
} as ComponentMeta<typeof RadioCardGroup>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RadioCardGroup> = (args) => (
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
)

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {}
