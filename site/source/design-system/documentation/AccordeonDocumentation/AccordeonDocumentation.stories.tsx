import type { Meta, StoryObj } from '@storybook/react'

import { AccordeonDocumentation } from './index'

const meta = {
	component: AccordeonDocumentation,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof AccordeonDocumentation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<AccordeonDocumentation>
			<summary>Comment calculer mon abattement ?</summary>
			<p>
				L'abattement forfaitaire est calculé automatiquement sur vos recettes
				brutes :
			</p>
			<ul>
				<li>50% pour une location meublée classique</li>
				<li>71% pour une location meublée de tourisme classée</li>
			</ul>
		</AccordeonDocumentation>
	),
}

export const PlusieursAccordeons: Story = {
	name: 'Plusieurs accordéons',
	render: () => (
		<div>
			<AccordeonDocumentation>
				<summary>Qu'est-ce que le régime micro-BIC ?</summary>
				<p>
					Le régime micro-BIC est un régime fiscal simplifié pour les loueurs en
					meublé dont les recettes ne dépassent pas certains plafonds.
				</p>
			</AccordeonDocumentation>
			<AccordeonDocumentation>
				<summary>Quels sont les plafonds de recettes ?</summary>
				<ul>
					<li>77 700 € pour une location meublée classique</li>
					<li>188 700 € pour une location meublée de tourisme classée</li>
				</ul>
			</AccordeonDocumentation>
			<AccordeonDocumentation>
				<summary>Comment déclarer mes revenus ?</summary>
				<p>
					Vous devez déclarer vos recettes brutes dans la catégorie des BIC
					(Bénéfices Industriels et Commerciaux) sur votre déclaration de
					revenus.
				</p>
			</AccordeonDocumentation>
		</div>
	),
}

export const AvecContenuComplexe: Story = {
	name: 'Avec contenu complexe',
	render: () => (
		<AccordeonDocumentation open>
			<summary>Détails techniques du calcul</summary>
			<div>
				<h4>Formule de calcul</h4>
				<p>Base imposable = Recettes brutes × (1 - Taux d'abattement)</p>
				<h4>Exemple pratique</h4>
				<p>Pour des recettes de 50 000 € en location classique :</p>
				<ul>
					<li>Abattement : 50 000 × 50% = 25 000 €</li>
					<li>Base imposable : 50 000 - 25 000 = 25 000 €</li>
				</ul>
				<h4>Points d'attention</h4>
				<p>
					N'oubliez pas que les cotisations sociales sont calculées sur la base
					imposable après abattement.
				</p>
			</div>
		</AccordeonDocumentation>
	),
}
