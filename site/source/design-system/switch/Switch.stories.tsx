import { ComponentStory, ComponentMeta } from '@storybook/react'

import DesignSystemThemeProvider from 'DesignSystem/root'
import { Switch } from 'DesignSystem/switch'
import { GlobalStyle } from 'DesignSystem/index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Switch,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as ComponentMeta<typeof Switch>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Switch> = (args) => (
	<DesignSystemThemeProvider>
		<GlobalStyle />
		<Switch {...args} />
	</DesignSystemThemeProvider>
)

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {}

export const Selected = Template.bind({})
Selected.args = {
	isSelected: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
	isDisabled: true,
}
