import { Meta, StoryObj } from '@storybook/react'
import { Option } from 'effect'

import { BlocMontants } from '@/components/Simulateur/BlocMontants'
import { eurosParAn } from '@/domaine/Montant'

import { ObjectifDeSimulation } from './ObjectifDeSimulation'

const meta: Meta<typeof ObjectifDeSimulation> = {
	component: ObjectifDeSimulation,
	title: 'Simulation/ObjectifDeSimulation',
	decorators: [
		(Story) => (
			<BlocMontants>
				<Story />
			</BlocMontants>
		),
	],
}

export default meta

type Story = StoryObj<typeof ObjectifDeSimulation>

export const Simple: Story = {
	args: {
		id: 'objectif-simple',
		titre: 'Cotisation maladie annuelle',
		valeur: Option.some(eurosParAn(1800)),
	},
}

export const AvecSousTitre: Story = {
	args: {
		id: 'objectif-sous-titre',
		titre: 'Cotisation maladie annuelle',
		sousTitre:
			'Estimation d’après vos revenus 2026,\napplicable à votre cotisation 2028.',
		valeur: Option.some(eurosParAn(1800)),
	},
}
