import Warning from 'Components/ui/WarningBlock'
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
							Les calculs sont indicatifs. Ils ne se substituent pas aux
							décomptes réels de l’Urssaf, du fisc ou autre.
						</Trans>
					</li>
				)}
				{simulateur == 'indépendant' && (
					<Trans i18nKey="simulateurs.warning.indépendant">
						<li>
							Le simulateur ne prend pas en compte les régimes micro-BNC et
							micro-BIC.
						</li>
					</Trans>
				)}
				{simulateur == 'profession-libérale' && (
					<Trans i18nKey="simulateurs.warning.profession-libérale">
						<li>
							Ce simulateur est à destination des professions libérales en BNC.
							Il ne prend pas en compte les sociétés d'exercice libéral ni le
							régime micro-BNC.
						</li>
					</Trans>
				)}
				{simulateur === 'SASU' && (
					<li>
						<Trans i18nKey="simulateurs.warning.sasu">
							L'impôt sur les sociétés et la gestion des dividendes ne sont pas
							encore implémentés.
						</Trans>
					</li>
				)}
				{simulateur === 'artiste-auteur' && (
					<>
						<li>
							<Trans i18nKey="simulateurs.warning.artiste-auteur.1">
								Cette estimation est proposée à titre indicatif. Elle est faite
								à partir des éléments réglementaires applicables et des éléments
								que vous avez saisis, mais elle ne tient pas compte de
								l'ensemble de votre situation. Le montant réel de vos
								cotisations peut donc être différent.
							</Trans>
						</li>
						<li>
							<Trans i18nKey="simulateurs.warning.artiste-auteur.2">
								Ce simulateur permet d'estimer le montant de vos cotisations
								pour l'année 2020 à partir de votre revenu projeté
							</Trans>
						</li>
					</>
				)}
				{['indépendant', 'profession-libérale'].includes(simulateur) && (
					<li>
						<Trans i18nKey="simulateurs.warning.année-courante">
							Le montant des cotisations est calculé pour un revenu sur l'année
							2020.
						</Trans>
					</li>
				)}
				{['profession-libérale'].includes(simulateur) && (
					<li>
						<Trans i18nKey="simulateurs.warning.cotisations-ordinales">
							Pour les professions réglementées, le simulateur ne calcule pas le
							montant des cotisations à l'ordre. Elles doivent être ajoutées
							manuellement dans la case « charges de fonctionnement ».
						</Trans>
					</li>
				)}
			</ul>
		</Warning>
	)
}
