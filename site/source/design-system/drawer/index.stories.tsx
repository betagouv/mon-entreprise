import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Drawer } from '@/design-system/drawer'

import { Button } from '../buttons'
import { DrawerButtonProps } from './Drawer'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Drawer,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: {
			type: 'string',
		},
		trigger: {
			type: 'function',
		},
		isDismissable: {
			type: 'boolean',
		},
		onConfirm: {
			type: 'function',
		},
		confirmLabel: {
			type: 'string',
		},
		cancelLabel: {
			type: 'string',
		},
	},
} as ComponentMeta<typeof Drawer>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Drawer> = (args) => <Drawer {...args} />

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {
	children: <div>Coucou, je suis ouvert !</div>,
	trigger: (buttonProps: DrawerButtonProps) => (
		<Button color="primary" light {...buttonProps}>
			Ouvrir le tiroir
		</Button>
	),
	isDismissable: true,
	// eslint-disable-next-line no-console
	onConfirm: () => console.log('onConfirm appelé !'),
	confirmLabel: 'Sauvegarder',
	cancelLabel: 'Annuler',
}
