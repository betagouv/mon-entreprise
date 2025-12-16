import { Meta, StoryObj } from '@storybook/react'

import { RegimeCotisation } from '@/contextes/économie-collaborative'

import { RégimeTag } from './RégimeTag'

const meta: Meta<typeof RégimeTag> = {
	component: RégimeTag,
	title: 'Économie Collaborative/RégimeTag',
	args: {
		régime: RegimeCotisation.microEntreprise,
	},
}

export default meta

type Story = StoryObj<typeof RégimeTag>

export const AutoEntrepreneur: Story = {
	args: {
		régime: RegimeCotisation.microEntreprise,
	},
}

export const RégimeGénéral: Story = {
	args: {
		régime: RegimeCotisation.regimeGeneral,
	},
}

export const TravailleurIndépendant: Story = {
	args: {
		régime: RegimeCotisation.travailleurIndependant,
	},
}

export const LibelléCompletAE: Story = {
	args: {
		régime: RegimeCotisation.microEntreprise,
		affichage: 'libellé',
	},
}

export const LibelléCompletRG: Story = {
	args: {
		régime: RegimeCotisation.regimeGeneral,
		affichage: 'libellé',
	},
}

export const LibelléCompletTI: Story = {
	args: {
		régime: RegimeCotisation.travailleurIndependant,
		affichage: 'libellé',
	},
}

export const TousLesRégimes: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
			<RégimeTag régime={RegimeCotisation.regimeGeneral} />
			<RégimeTag régime={RegimeCotisation.microEntreprise} />
			<RégimeTag régime={RegimeCotisation.travailleurIndependant} />
		</div>
	),
}

export const TousLesRégimesLibellésComplets: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				gap: '1rem',
				flexDirection: 'column',
				alignItems: 'flex-start',
			}}
		>
			<RégimeTag régime={RegimeCotisation.regimeGeneral} affichage="libellé" />
			<RégimeTag
				régime={RegimeCotisation.microEntreprise}
				affichage="libellé"
			/>
			<RégimeTag
				régime={RegimeCotisation.travailleurIndependant}
				affichage="libellé"
			/>
		</div>
	),
}
