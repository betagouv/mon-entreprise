import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { ChoiceOption } from './ChoiceOption'
import SearchChoiceGroup from './SearchChoiceGroup'

const options: ChoiceOption[] = [
	{
		key: 'fonderie',
		value: 'fonderie',
		label: 'Fonderie des métaux légers ou non ferreux.',
		description: 'INDUSTRIES DE LA MÉTALLURGIE',
		detail: '6,23 %',
	},
	{
		key: 'restaurants',
		value: 'restaurants',
		label: 'Restaurants, café-tabac, hôtels avec ou sans restaurant et foyers.',
		description: "SERVICES, COMMERCES ET INDUSTRIES DE L'ALIMENTATION",
		detail: '1,78 %',
	},
	{
		key: 'isolation',
		value: 'isolation',
		label: "Travaux d'isolation.",
		detail: '2,46 %',
	},
]

const monterRecherche = (value?: string) => {
	const user = userEvent.setup()
	const onChange = vi.fn()
	render(
		<TestProvider>
			<SearchChoiceGroup options={options} onChange={onChange} value={value} />
		</TestProvider>
	)

	return { user, onChange, champ: screen.getByRole('searchbox') }
}

describe('SearchChoiceGroup', () => {
	it('n’affiche aucune option avant deux caractères saisis', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'r')

		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('affiche les options correspondant à la recherche, avec leur détail et leur description', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'restaurant')

		expect(
			screen.getByText(
				'Restaurants, café-tabac, hôtels avec ou sans restaurant et foyers.'
			)
		).toBeInTheDocument()
		expect(screen.getByText('1,78 %')).toBeInTheDocument()
		expect(
			screen.getByText("SERVICES, COMMERCES ET INDUSTRIES DE L'ALIMENTATION")
		).toBeInTheDocument()
		expect(
			screen.queryByText('Fonderie des métaux légers ou non ferreux.')
		).not.toBeInTheDocument()
	})

	it('tolère une faute de frappe', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'fondrie')

		expect(
			screen.getByText('Fonderie des métaux légers ou non ferreux.')
		).toBeInTheDocument()
	})

	it('cherche aussi dans la description', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'métallurgie')

		expect(
			screen.getByText('Fonderie des métaux légers ou non ferreux.')
		).toBeInTheDocument()
	})

	it('signale quand aucune option ne correspond', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'zzzzzz')

		expect(screen.getByText('Aucun résultat')).toBeInTheDocument()
	})

	it('choisit l’option sélectionnée et l’affiche dans le champ', async () => {
		const { user, champ, onChange } = monterRecherche()

		await user.type(champ, 'fonderie')
		await user.click(
			screen.getByRole('button', {
				name: 'Fonderie des métaux légers ou non ferreux. (6,23 %), sélectionner',
			})
		)

		expect(onChange).toHaveBeenCalledWith('fonderie')
		expect(champ).toHaveValue('Fonderie des métaux légers ou non ferreux.')
		expect(
			screen.queryByRole('button', { name: /sélectionner/ })
		).not.toBeInTheDocument()
	})

	it('remet le focus sur le champ après le choix d’une option', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'fonderie')
		await user.click(
			screen.getByRole('button', {
				name: 'Fonderie des métaux légers ou non ferreux. (6,23 %), sélectionner',
			})
		)

		expect(champ).toHaveFocus()
	})

	it('n’échappe pas les apostrophes dans le nom accessible des options', async () => {
		const { user, champ } = monterRecherche()

		await user.type(champ, 'isolation')

		expect(
			screen.getByRole('button', {
				name: "Travaux d'isolation. (2,46 %), sélectionner",
			})
		).toBeInTheDocument()
	})

	it('affiche l’option déjà choisie dans le champ', () => {
		const { champ } = monterRecherche('restaurants')

		expect(champ).toHaveValue(
			'Restaurants, café-tabac, hôtels avec ou sans restaurant et foyers.'
		)
	})
})
