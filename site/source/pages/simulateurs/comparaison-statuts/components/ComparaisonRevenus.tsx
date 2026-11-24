import { Either, Option } from 'effect'
import { Trans, useTranslation } from 'react-i18next'

import { useComparateur } from '@/contextes/comparateur'
import { H4, InfoButton, Li, Strong, Ul } from '@/design-system'
import { arrondirÀLEuro, estZéro, montantToString } from '@/domaine/Montant'
import {
	plus,
	pourcentageParRapportÀ,
	toEurosParMois,
} from '@/domaine/MontantRecurrent'
import { arrondirÀLUnité, quantitéToString } from '@/domaine/Quantite'

import { ComparaisonÉlément } from './ComparaisonElement'
import { TableauRevenus } from './TableauRevenus'
import WarningTooltip from './WarningTooltip'

export const ComparaisonRevenus = () => {
	const { t } = useTranslation()
	const { comparaison, situation } = useComparateur()

	const comparaisonRevenuNetAprèsImpôt = comparaison.map((résultatModèle) => {
		const revenu = résultatModèle.revenu()

		const seuilMicro = résultatModèle.warning?.().seuilMicro

		return {
			statut: résultatModèle.statut.étiquette,
			valeur: revenu.revenuNetAprèsImpôt,
			warning: seuilMicro && (
				<WarningTooltip
					tooltip={
						<Trans
							i18nKey="pages.simulateurs.comparaison-statuts.warning.auto-entrepreneur"
							shouldUnescape
						>
							Vous allez dépasser le plafond de la micro-entreprise (
							{{ montant: montantToString(seuilMicro) }} de chiffre d’affaires).
						</Trans>
					}
				/>
			),
			footer: (() => {
				if (estZéro(revenu.bénéfice)) {
					return
				}

				const dépenses = résultatModèle.dépenses()

				const revenuAvantImpôt = montantToString(
					arrondirÀLEuro(
						toEurosParMois(plus(revenu.revenuNetAprèsImpôt, dépenses.impôt))
					)
				)

				const pourcentageSurBénéfice = quantitéToString(
					arrondirÀLUnité(
						Either.getOrThrow(
							pourcentageParRapportÀ(dépenses.cotisations, revenu.bénéfice)
						)
					)
				)
				const pourcentageSurCA = quantitéToString(
					arrondirÀLUnité(
						Either.getOrThrow(
							pourcentageParRapportÀ(
								dépenses.cotisations,
								Option.getOrThrow(situation.chiffreDAffaires)
							)
						)
					)
				)

				return (
					<Ul>
						<Li>
							<Trans
								i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.1"
								shouldUnescape
							>
								Soit <Strong>{{ revenuAvantImpôt }}</Strong> avant impôts
							</Trans>
						</Li>{' '}
						<Li>
							{résultatModèle.nomModèle === 'modele-social' ? (
								<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.2">
									Avec <Strong>{{ pourcentageSurCA }}</Strong> de cotisations
									sociales sur le chiffre d’affaires (soit{' '}
									<Strong>{{ pourcentageSurBénéfice }}</Strong> du bénéfice)
								</Trans>
							) : (
								<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.3">
									Avec <Strong>{{ pourcentageSurBénéfice }}</Strong> de
									cotisations sociales sur le bénéfice
								</Trans>
							)}
						</Li>
					</Ul>
				)
			})(),
		}
	})

	return (
		<>
			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.revenus.h4',
					'Revenu net mensuel après impôts'
				)}

				<InfoButton
					subject={t(
						'pages.simulateurs.comparaison-statuts.items.revenus.info.subject',
						'Vos revenus'
					)}
				>
					<TableauRevenus />
				</InfoButton>
			</H4>

			<ComparaisonÉlément
				comparaison={comparaisonRevenuNetAprèsImpôt}
				convertisseur={toEurosParMois}
			/>
		</>
	)
}
