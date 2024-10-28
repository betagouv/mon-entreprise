import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import Warning from '@/components/ui/WarningBlock'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
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
		.slice(-4)

	return (
		<Warning
			localStorageKey={'app::simulateurs:warning-folded:v1:' + simulateur}
		>
			{simulateur === 'auto-entrepreneur' && (
				<Ul>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.auto-entrepreneur">
							Les auto-entrepreneurs bénéficient d’un régime très simplifié avec
							un taux forfaitaire pour le calcul des cotisations et
							contributions sociales appliqué sur le chiffre d’affaires. Selon
							le choix de la modalité de paiement des impôts il est appliqué un
							abattement forfaitaire au titre des frais professionnels. Il n’est
							pas possible de déduire des charges réelles en plus. Votre revenu
							net est donc le chiffre d’affaires moins toutes les charges
							engagées pour l’entreprise.
						</Trans>
					</StyledLi>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.cfe">
							Le simulateur n'intègre pas la cotisation foncière des entreprise
							(CFE) qui est dûe dès la deuxième année d'exercice. Son montant
							varie fortement en fonction du chiffre d'affaires et de la
							domiciliation de l'entreprise.{' '}
							<Link
								aria-label="Plus d'infos, en savoir plus sur service-public.fr, nouvelle fenêtre"
								href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23547"
							>
								Plus d'infos.
							</Link>
						</Trans>
					</StyledLi>
				</Ul>
			)}
			{simulateur === 'profession-libérale' && (
				<Ul>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.profession-libérale">
							Ce simulateur est à destination des professions libérales en BNC.
							Il ne prend pas en compte les sociétés d'exercice libéral.
						</Trans>
					</StyledLi>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.libérale.année-courante">
							Le montant calculé correspond aux cotisations de l’année{' '}
							{{ year }} (pour un revenu {{ year }}).
						</Trans>
					</StyledLi>{' '}
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.cotisations-ordinales">
							Pour les professions réglementées, le simulateur ne calcule pas le
							montant des cotisations à l'ordre. Elles doivent être ajoutées
							manuellement dans la case « charges de fonctionnement ».
						</Trans>
					</StyledLi>
				</Ul>
			)}
			{simulateur === 'artiste-auteur' && (
				<Body>
					<Trans i18nKey="simulateurs.warning.artiste-auteur">
						Ce simulateur permet d'estimer le montant de vos cotisations à
						partir de votre revenu projeté.
					</Trans>
				</Body>
			)}
			{simulateur === 'coût-création-entreprise' && (
				<Ul>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.coût-création-entreprise.pas-reprise">
							Ce simulateur calcule les frais de création pour les nouvelles
							entreprises. Il ne prend pas en compte le cas des reprises
							d'entreprises existantes.
						</Trans>
					</StyledLi>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.coût-création-entreprise.greffe">
							Des frais de greffe peuvent être facturés en raison d'informations
							ou de documents manquants ou incorrects. Par ailleurs, en cas
							d'envoi de courrier, le greffe facture les frais postaux.
						</Trans>
					</StyledLi>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.coût-création-entreprise.JAL">
							Ce simulateur calcule les frais de créations uniquement pour les
							SARL, EURL, SAS, SASU, EI et SEL. Il ne prend pas encore en compte
							les autres formes de société (SA, SCA, SCS, SCI, SCP, SNC, SCM,
							coopératives, GIE, GAEC, etc.)
						</Trans>
					</StyledLi>
				</Ul>
			)}
			{simulateur === 'indépendant' && (
				<Body>
					<Trans i18nKey="simulateurs.warning.indépendant.année-courante">
						Le montant calculé correspond aux cotisations de l’année {{ year }}{' '}
						(pour un revenu {{ year }}).
					</Trans>
				</Body>
			)}
			{simulateur === 'sasu' && (
				<Body>
					<Trans i18nKey="simulateurs.warning.sasu">
						Ce simulateur ne gère pas le cas des SAS(U) à l'impôt sur le revenu
						(IR). Seule l'option pour l'impôt sur les sociétés est implémentée
						(IS).
					</Trans>
				</Body>
			)}
			{simulateur === 'salarié' && (
				<Body>
					<Trans i18nKey="simulateurs.warning.salarié">
						Le simulateur ne prend pour l'instant pas en compte les accords et
						conventions collectives, ni la myriade d'aides aux entreprises.
						Trouvez votre convention collective{' '}
						<Link
							href="https://code.travail.gouv.fr/outils/convention-collective#entreprise"
							aria-label="ici, trouvez votre convention collective sur code.travail.gouv.fr, nouvelle fenêtre"
						>
							ici
						</Link>
						, et explorez les aides sur&nbsp;
						<Link
							href="https://www.aides-entreprises.fr"
							aria-label="aides-entreprises.fr, nouvelle fenêtre"
						>
							aides-entreprises.fr
						</Link>
						.
					</Trans>
				</Body>
			)}
			{simulateur === 'chômage-partiel' && (
				<Ul>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.chômage-partiel.1">
							Ce simulateur ne prend pas en compte les rémunérations brutes
							définies sur 39h hebdomadaires.
						</Trans>
					</StyledLi>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.chômage-partiel.2">
							De même, il ne prend pas en compte les indemnités complémentaire
							d'activité partielle prévue par une convention/accord collectif ou
							une décision unilatérale de l'employeur.
						</Trans>
					</StyledLi>
				</Ul>
			)}
			{simulateur === 'is' && (
				<Body>
					<Trans i18nKey="simulateurs.warning.is">
						Ce simulateur s’adresse aux{' '}
						<abbr title="Très Petites Entreprises">TPE</abbr> : il prend en
						compte les taux réduits de l’impôt sur les sociétés.
					</Trans>
				</Body>
			)}
			{simulateur === 'dividendes' && (
				<Ul>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.dividendes.1">
							Cette simulation ne concerne que les sociétés françaises à l’impôt
							sur les sociétés (IS), et ne concerne pas les travailleurs
							indépendants non salariés.
						</Trans>
					</StyledLi>
					<StyledLi>
						<Trans i18nKey="simulateurs.warning.dividendes.2">
							Le montant de l'impôt sur les dividendes est calculé en plus de
							l’impôt sur les autres revenus imposables.
						</Trans>
					</StyledLi>
				</Ul>
			)}
			{simulateur === 'réduction-générale' && (
				<>
					<Body>
						<Trans i18nKey="simulateurs.warning.réduction-générale.beta">
							<Strong>Ce simulateur est en cours de développement.</Strong> Il
							propose uniquement le calcul de la{' '}
							<abbr title="Réduction Générale des Cotisations Patronales">
								RGCP
							</abbr>{' '}
							à partir d'une rémunération mensuelle ou annuelle. Pour une
							version complète, utilisez{' '}
							<Link
								aria-label="Simulateur de calcul de la réduction générale des cotisations sur urssaf.fr, nouvelle fenêtre"
								href="https://www.declaration.urssaf.fr/calcul/"
							>
								le simulateur d'urssaf.fr.
							</Link>
						</Trans>
					</Body>
					<Ul>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.réduction-générale.1">
								La rémunération brute inclue : le paiement des heures
								supplémentaires et complémentaires, les primes et les indemnités
								de CDD.
							</Trans>
						</StyledLi>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.réduction-générale.2">
								Ce simulateur ne gère pas les mois incomplets (embauche,
								absence, départ...).
							</Trans>
						</StyledLi>
						<StyledLi>
							<Trans i18nKey="simulateurs.warning.réduction-générale.3">
								Ce simulateur n'intègre pas toutes les règles de calcul
								spécifiques (Entreprises de Travail Temporaire, salariés des
								transports routiers soumis à un horaire d'équivalence...). Il ne
								tient pas non plus compte des taux et/ou répartition
								particuliers de la cotisation de retraite complémentaire
								appliqués dans certaines entreprises.
							</Trans>
						</StyledLi>
					</Ul>
				</>
			)}
			<Body>
				<Trans i18nKey="simulateurs.warning.general">
					<Strong>Les calculs sont indicatifs.</Strong> Ils sont faits à partir
					des éléments que vous avez saisis et des éléments réglementaires
					applicables, mais ils ne tiennent pas compte de l'ensemble de votre
					situation. Ils ne se substituent pas aux décomptes réels de l’Urssaf,
					de l'administration fiscale ou de toute autre organisme.
				</Trans>
			</Body>
		</Warning>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`
