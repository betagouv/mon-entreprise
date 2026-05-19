import { Meta, StoryObj } from '@storybook/react'

import { Button } from './'

const meta: Meta<typeof Button> = {
	component: Button,
	argTypes: {
		children: { type: 'string' },
	},
}

export default meta

type Story = StoryObj<typeof Button>

export const Tailles: Story = {
	render: () => (
		<>
			<Button size="XL">Bouton XL</Button>
			&nbsp;
			<Button size="MD">Bouton MD</Button>
			&nbsp;
			<Button size="XS">Bouton XS</Button>
			&nbsp;
			<Button size="XXS">Bouton XXS</Button>
		</>
	),
}

export const Couleurs: Story = {
	render: () => (
		<>
			<Button color="primary">Primary</Button>
			&nbsp;
			<Button color="secondary">Secondary</Button>
			&nbsp;
			<Button color="tertiary">Tertiary</Button>
			&nbsp;
			<Button color="error">Error</Button>
			&nbsp;
			<Button color="success">Success</Button>
			<br />
			<br />
			<Button color="primary" light>
				Primary light
			</Button>
			&nbsp;
			<Button color="secondary" light>
				Secondary light
			</Button>
			&nbsp;
			<Button color="tertiary" light>
				Tertiary light
			</Button>
			&nbsp;
			<Button color="error" light>
				Error light
			</Button>
			&nbsp;
			<Button color="success" light>
				Success light
			</Button>
		</>
	),
}

export const Disabled: Story = {
	render: () => (
		<>
			<Button isDisabled>Bouton désactivé</Button>
			&nbsp;
			<Button isDisabled light>
				Bouton light désactivé
			</Button>
		</>
	),
}
