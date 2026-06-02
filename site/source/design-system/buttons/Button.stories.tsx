import { Meta, StoryObj } from '@storybook/react'
import styled from 'styled-components'

import {
	ArrowDownIcon,
	EditIcon,
	PaperClip,
	Phone,
	ReturnIconLeft,
} from '../icons'
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
		<Ligne>
			<Button size="XL">Bouton XL</Button>
			<Button size="MD">Bouton MD</Button>
			<Button size="XS">Bouton XS</Button>
			<Button size="XXS">Bouton XXS</Button>
		</Ligne>
	),
}

export const Couleurs: Story = {
	render: () => (
		<>
			<Ligne>
				<Button color="primary">Primary</Button>
				<Button color="secondary">Secondary</Button>
				<Button color="tertiary">Tertiary</Button>
				<Button color="error">Error</Button>
				<Button color="success">Success</Button>
			</Ligne>
			<br />
			<Ligne>
				<Button color="primary" light>
					Primary light
				</Button>
				<Button color="secondary" light>
					Secondary light
				</Button>
				<Button color="tertiary" light>
					Tertiary light
				</Button>
				<Button color="error" light>
					Error light
				</Button>
				<Button color="success" light>
					Success light
				</Button>
			</Ligne>
		</>
	),
}

export const AvecIcône: Story = {
	render: () => (
		<>
			<Ligne>
				<Button color="primary">
					<ArrowDownIcon /> Primary
				</Button>
				<Button color="secondary">
					<PaperClip /> Secondary
				</Button>
				<Button color="tertiary">
					<Phone /> Tertiary
				</Button>
				<Button color="error">
					<ReturnIconLeft /> Error
				</Button>
				<Button color="success">
					<EditIcon /> Success
				</Button>
			</Ligne>
			<br />
			<Ligne>
				<Button color="primary" light>
					<ArrowDownIcon /> Primary light
				</Button>
				<Button color="secondary" light>
					<PaperClip /> Secondary light
				</Button>
				<Button color="tertiary" light>
					<Phone /> Tertiary light
				</Button>
				<Button color="error" light>
					<ReturnIconLeft /> Error light
				</Button>
				<Button color="success" light>
					<EditIcon /> Success light
				</Button>
			</Ligne>
		</>
	),
}

export const Disabled: Story = {
	render: () => (
		<Ligne>
			<Button isDisabled>Bouton désactivé</Button>
			<Button isDisabled light>
				Bouton light désactivé
			</Button>
		</Ligne>
	),
}

const Ligne = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`
