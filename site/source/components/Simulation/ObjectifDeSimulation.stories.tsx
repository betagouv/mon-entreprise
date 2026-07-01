import { Meta, StoryObj } from '@storybook/react'
import { Option } from 'effect'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { SmallBody } from '@/design-system'
import { eurosParAn } from '@/domaine/Montant'

import { ObjectifDeSimulation } from './ObjectifDeSimulation'
import { SimulationGoalsContainer } from './SimulationGoalsContainer'

const meta: Meta<typeof ObjectifDeSimulation> = {
	component: ObjectifDeSimulation,
	title: 'Simulation/ObjectifDeSimulation',
	decorators: [
		(Story) => (
			<ForceThemeProvider forceTheme="dark">
				<SimulationGoalsContainer $isEmbeded={false} $isFirstStepCompleted>
					<Story />
				</SimulationGoalsContainer>
			</ForceThemeProvider>
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

export const AvecExplication: Story = {
	args: {
		id: 'objectif-explication',
		titre: 'Cotisation maladie annuelle',
		explication: (
			<SmallBody style={{ margin: 0 }}>
				Estimation d’après vos revenus 2026, applicable à votre cotisation 2028.
			</SmallBody>
		),
		valeur: Option.some(eurosParAn(1800)),
	},
}
