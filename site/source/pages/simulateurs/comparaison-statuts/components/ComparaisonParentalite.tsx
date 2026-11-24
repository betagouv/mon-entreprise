import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useComparateur } from '@/contextes/comparateur'
import { Body, H4, Strong } from '@/design-system'
import { toEurosParJour } from '@/domaine/MontantRecurrent'

import { ComparaisonÉlément } from './ComparaisonElement'

export const ComparaisonParentalité = () => {
	const { t } = useTranslation()
	const { comparaison } = useComparateur()

	const comparaisonParentalité = comparaison.map((résultatModèle) => ({
		statut: résultatModèle.statut.étiquette,
		parentalité: résultatModèle.parentalité(),
	}))

	const comparaisonIndemnitésMaternitéPaternitéAdoption =
		comparaisonParentalité.map(({ parentalité, statut }) => ({
			statut,
			valeur: parentalité.indemnitésMaternitéPaternitéAdoption,
		}))

	const comparaisonAllocationNaissance = comparaisonParentalité.map(
		({ parentalité, statut }) => ({
			statut,
			valeur: parentalité.allocationNaissance,
		})
	)

	const comparaisonAllocationAdoption = comparaisonParentalité.map(
		({ parentalité, statut }) => ({
			statut,
			valeur: parentalité.allocationAdoption,
		})
	)

	return (
		<>
			<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.body">
				<BodyNoBottomMargin>
					Tous les statuts vous ouvrent le droit aux{' '}
					<Strong>indemnités journalières</Strong> de congé maternité,
					paternité, adoption.
				</BodyNoBottomMargin>
				<BodyNoTopMargin>
					Pour y prétendre, vous devez avoir cotisé{' '}
					<Strong>au moins 6 mois</Strong>.
				</BodyNoTopMargin>
			</Trans>

			<ComparaisonÉlément
				comparaison={comparaisonIndemnitésMaternitéPaternitéAdoption}
				convertisseur={toEurosParJour}
			/>

			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.parentalité.maternité.h4',
					'Maternité'
				)}
			</H4>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.maternité.body">
					En plus des indemnités journalières, vous pouvez aussi prétendre à une{' '}
					<Strong>
						allocation forfaitaire de repos maternel supplémentaire
					</Strong>
					.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonAllocationNaissance}
				libellé={t(
					'pages.simulateurs.comparaison-statuts.items.parentalité.maternité.label',
					'versés en deux fois'
				)}
			/>

			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.parentalité.adoption.h4',
					'Adoption'
				)}
			</H4>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.adoption.body">
					En plus des indemnités journalières, vous pouvez aussi prétendre à une{' '}
					<Strong>
						allocation forfaitaire de repos parental supplémentaire
					</Strong>
					.
				</Trans>
			</Body>

			<ComparaisonÉlément
				comparaison={comparaisonAllocationAdoption}
				libellé={t(
					'pages.simulateurs.comparaison-statuts.items.parentalité.adoption.label',
					'versés en une fois'
				)}
			/>
		</>
	)
}

const BodyNoBottomMargin = styled(Body)`
	margin-bottom: 0;
`
const BodyNoTopMargin = styled(Body)`
	margin-top: 0;
`
