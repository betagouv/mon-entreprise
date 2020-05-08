import Warning from 'Components/ui/WarningBlock'
import React from 'react'
import { Trans } from 'react-i18next'
import { SitePaths } from './utils/SitePathsContext'

type SimulateurWarningProps = {
	simulateur: Exclude<keyof SitePaths['simulateurs'], 'index'>
}

export default function SimulateurWarning({
	simulateur
}: SimulateurWarningProps) {
	return (
		<Warning
			localStorageKey={'app::simulateurs:warning-folded:v1:' + simulateur}
		>
			<ul>
				{simulateur == 'auto-entrepreneur' && (
					<>
						<li>
							<Trans i18nKey="simulateurs.warning.auto-entrepreneur">
								{' '}
								Les auto-entrepreneurs ne peuvent pas déduire leurs charges de
								leur chiffre d'affaires. Il faut donc{' '}
								<strong>
									retrancher au net tous les coûts liés à l'entreprise pour
									obtenir le revenu réellement perçu.
								</strong>
							</Trans>
						</li>
						<li>
							<Trans i18nKey="simulateurs.warning.cfe">
								Le simulateur n'intègre pas la cotisation foncière des
								entreprise (CFE) qui est dûe dès la deuxième année d'exercice.
								Son montant varie fortement en fonction du chiffre d'affaire et
								de la domiciliation de l'entreprise.{' '}
								<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23547">
									Plus d'infos.
								</a>
							</Trans>
						</li>
					</>
				)}
				{simulateur !== 'artiste-auteur' && (
					<li>
						<Trans i18nKey="simulateurs.warning.urssaf">
							Les calculs sont indicatifs et ne se substituent pas aux décomptes
							réels des Urssaf, impots.gouv.fr, ou autres.
						</Trans>
					</li>
				)}

				{simulateur === 'artiste-auteur' && (
					<>
						<li>
							<Trans i18nKey="simulateurs.warning.artiste-auteur">
								Cette estimation est proposée à titre indicatif. Elle est faite
								à partir des éléments réglementaires applicables et des éléments
								que vous avez saisis, mais elle ne tient pas compte de
								l'ensemble de votre situation. Le montant réel de vos
								cotisations peut donc être différent.
							</Trans>
						</li>
						<li>
							<Trans i18nKey="simlateurs.warning.artiste-auteur">
								Ce simulateur permet d'estimer le montant de vos cotisations
								pour l'année 2020 à partir de votre revenu projeté
							</Trans>
						</li>
					</>
				)}
			</ul>
		</Warning>
	)
}
