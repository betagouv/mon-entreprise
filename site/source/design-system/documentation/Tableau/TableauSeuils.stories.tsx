import type { Meta, StoryObj } from '@storybook/react'

import { Tableau } from './index'

const meta = {
	component: Tableau,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Tableau>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Tableau>
			<thead>
				<tr>
					<th>Type de location</th>
					<th>Plafond annuel</th>
					<th>Abattement forfaitaire</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Location meublée classique</td>
					<td>77 700 €</td>
					<td>50%</td>
				</tr>
				<tr>
					<td>Location meublée de tourisme classée</td>
					<td>188 700 €</td>
					<td>71%</td>
				</tr>
			</tbody>
		</Tableau>
	),
}

export const CotisationsSociales: Story = {
	name: 'Cotisations sociales',
	render: () => (
		<Tableau>
			<thead>
				<tr>
					<th>Régime</th>
					<th>Taux de cotisations</th>
					<th>Base de calcul</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Régime général (non professionnel)</td>
					<td>17,2%</td>
					<td>Revenus nets après abattement</td>
				</tr>
				<tr>
					<td>Régime micro-entrepreneur</td>
					<td>22,2%</td>
					<td>Chiffre d'affaires</td>
				</tr>
				<tr>
					<td>Loueur professionnel</td>
					<td>≈ 45%</td>
					<td>Bénéfice imposable</td>
				</tr>
			</tbody>
		</Tableau>
	),
}

export const ComparaisonRegimes: Story = {
	name: 'Comparaison des régimes',
	render: () => (
		<Tableau>
			<thead>
				<tr>
					<th>Critère</th>
					<th>Micro-BIC</th>
					<th>Régime réel</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Plafond de recettes</td>
					<td>
						77 700 € (classique)
						<br />
						188 700 € (tourisme)
					</td>
					<td>Aucun</td>
				</tr>
				<tr>
					<td>Déduction des charges</td>
					<td>Forfaitaire (50% ou 71%)</td>
					<td>Charges réelles</td>
				</tr>
				<tr>
					<td>Comptabilité</td>
					<td>Simplifiée</td>
					<td>Complète</td>
				</tr>
				<tr>
					<td>TVA</td>
					<td>Non assujetti</td>
					<td>Possible sur option</td>
				</tr>
			</tbody>
		</Tableau>
	),
}
