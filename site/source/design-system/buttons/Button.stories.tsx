import { ComponentStory, ComponentMeta } from '@storybook/react'

import DesignSystemThemeProvider from 'DesignSystem/root'
import { Button } from 'DesignSystem/buttons'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Button,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
	<DesignSystemThemeProvider>
		<Button {...args} />
	</DesignSystemThemeProvider>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	size: 'XL',
	color: 'primary',
	children: <>Primary XL button</>,
}

export const Secondary = Template.bind({})
Secondary.args = {
	size: 'XS',
	color: 'secondary',
	children: <>Secondary XS button</>,
}