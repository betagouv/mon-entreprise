import { Evaluation } from 'publicodes'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import Warning from '@/components/ui/WarningBlock'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { AbsoluteSitePaths } from '@/sitePaths'

import { EngineContext } from './utils/EngineContext'

type SimulateurWarningProps = {
	simulateur: Exclude<keyof AbsoluteSitePaths['simulateurs'], 'index'>
}

export default function SimulateurWarning({
	simulateur,
}: SimulateurWarningProps) {
	const year = useContext(EngineContext)
		.evaluate('date')
		.nodeValue?.toString()
		.slice(-4) as Evaluation<number> | undefined

	console.log(simulateur)

	return (
		<Warning
			localStorageKey={'app::simulateurs:warning-folded:v1:' + simulateur}
		>
			<Ul>
				{simulateur === 'auto-entrepreneur' && (
					<>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.auto-entrepreneur">
								Les auto-entrepreneurs bénéficient d’un régime très simplifié
								avec un taux forfaitaire pour le calcul des cotisations et
								contributions sociales appliqué sur le chiffre d’affaires. Selon
								le choix de la modalité de paiement des impôts il est appliqué
								un abattement forfaitaire au titre des frais professionnels. Il
								n’est pas possible de déduire des charges réelles en plus. Votre
								revenu net est donc le chiffre d’affaires moins toutes les
								charges engagées pour l’entreprise.
							</Trans>
						</StyledLi>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.cfe">
								Le simulateur n'intègre pas la cotisation foncière des
								entreprise (CFE) qui est dûe dès la deuxième année d'exercice.
								Son montant varie fortement en fonction du chiffre d'affaires et
								de la domiciliation de l'entreprise.{' '}
								<Link
									aria-label="Plus d'infos, en savoir plus sur service-public.fr, nouvelle fenêtre"
									href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23547"
								>
									Plus d'infos.
								</Link>
							</Trans>
						</StyledLi>
					</>
				)}
				{simulateur !== 'artiste-auteur' && (
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.urssaf">
							Les calculs sont indicatifs. Ils ne se substituent pas aux
							décomptes réels de l’Urssaf, de l’administration fiscale ou de
							toute autre organisme.
						</Trans>
					</StyledLi>
				)}

				{simulateur === 'profession-libérale' && (
					<Trans i18nKey="simulateurs.warning.profession-libérale">
						<StyledLi>
							Ce simulateur est à destination des professions libérales en BNC.
							Il ne prend pas en compte les sociétés d'exercice libéral.
						</StyledLi>
					</Trans>
				)}
				{simulateur === 'artiste-auteur' && (
					<>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.artiste-auteur.1">
								Cette estimation est proposée à titre indicatif. Elle est faite
								à partir des éléments réglementaires applicables et des éléments
								que vous avez saisis, mais elle ne tient pas compte de
								l'ensemble de votre situation. Le montant réel de vos
								cotisations peut donc être différent.
							</Trans>
						</StyledLi>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.artiste-auteur.2">
								Ce simulateur permet d'estimer le montant de vos cotisations à
								partir de votre revenu projeté
							</Trans>
						</StyledLi>
					</>
				)}
				{['indépendant', 'profession-libérale'].includes(simulateur) && (
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.année-courante">
							Le montant calculé correspond aux cotisations de l’année{' '}
							{{ year }} (pour un revenu {{ year }}).
						</Trans>
					</StyledLi>
				)}
				{['profession-libérale'].includes(simulateur) && (
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.cotisations-ordinales">
							Pour les professions réglementées, le simulateur ne calcule pas le
							montant des cotisations à l'ordre. Elles doivent être ajoutées
							manuellement dans la case « charges de fonctionnement ».
						</Trans>
					</StyledLi>
				)}
				{simulateur === 'coût-création-entreprise' && (
					<>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.coût-création-entreprise.greffe">
								Des frais de greffe peuvent être facturés en raison de documents
								manquants ou incorrects.
							</Trans>
						</StyledLi>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.coût-création-entreprise.JAL">
								Des frais de publication dans le Journal Officiel des Annonces
								Légales (qui sont dépendent de la taille de l'annonce) peuvent
								être requis lors de la création ou modification de votre
								entreprise.
							</Trans>
						</StyledLi>
					</>
				)}
			</Ul>
		</Warning>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`
