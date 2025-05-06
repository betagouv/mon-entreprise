import { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { Drawer } from '@/design-system/drawer'

import { Button } from '../buttons'
import { DrawerButtonProps } from './Drawer'

const meta: Meta<typeof Drawer> = {
	component: Drawer,
	render: (args) => (
		<MemoryRouter initialEntries={['/some/route']}>
			<Drawer {...args}>{args.children}</Drawer>
		</MemoryRouter>
	),
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
}

export default meta

type Story = StoryObj<typeof Drawer>

export const Basic: Story = {
	args: {
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
	},
}
