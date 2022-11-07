import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { useSitePaths } from '@/sitePaths'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TrackPage } from '../ATInternetTracking'
import Meta from '../components/utils/Meta'
import getMetadataSrc from './Simulateurs/metadata-src'

export default function Plan() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()
	const metadata = getMetadataSrc(t)

	return (
		<Trans i18nKey="pages.plan-du-site">
			<H1>Plan du site</H1>
			<Meta
				page="plan-du-site"
				title="Plan du site"
				description="Page détaillant l'arborescence du site Mon-Entreprise."
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />

			<StyledUl role="main">
				<Li as="h2">
					<Link to={absoluteSitePaths.index}>Page d'accueil</Link>
				</Li>
				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.créer.index}>
						Créer une entreprise
					</HeaderLink>
					<Ul>
						<Li>
							<Link to={absoluteSitePaths.créer.après}>Après la création</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.créer.guideStatut.index}>
								Choix du statut juridique
							</Link>
						</Li>
					</Ul>
				</Li>

				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.gérer.index}>
						Gérer mon activité
					</HeaderLink>
					<Ul>
						<Li>
							<Link to={absoluteSitePaths.gérer.embaucher}>Embaucher</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.gérer.sécuritéSociale}>
								Protection sociale
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.gérer.déclarationIndépendant.index}>
								Assistant à la détermination des charges sociales déductibles
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.gérer.formulaireMobilité}>
								Simulateur de demande de mobilité
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.simulateurs.index}>
						Simulateurs disponibles
					</HeaderLink>
					<Ul>
						{Object.entries(absoluteSitePaths.simulateurs)
							.filter(([key]) => {
								return !!metadata[
									key as keyof typeof absoluteSitePaths.simulateurs &
										keyof typeof metadata
								]
							})
							.map(([simulateurKey, simulateurPath]: [string, string]) => {
								return (
									<Li key={`list-item-${simulateurKey}`}>
										<Link to={simulateurPath}>
											{
												metadata[
													simulateurKey as keyof typeof absoluteSitePaths.simulateurs &
														keyof typeof metadata
												].title
											}
										</Link>
									</Li>
								)
							})}
						<Li key="list-item-comparaison">
							<Link to={absoluteSitePaths.simulateurs.comparaison}>
								Assistant au choix du statut juridique
							</Link>
						</Li>
						<Li key="list-item-economie-collaborative">
							<Link
								to={absoluteSitePaths.simulateurs.économieCollaborative.index}
							>
								Assistant à la déclaration des revenus des plateformes en ligne
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.nouveautés}>Nouveautés</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.budget}>Budget</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.accessibilité}>Accessibilité</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.stats}>Statistiques</Link>
				</Li>
				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.développeur.index}>
						Outils pour les développeurs
					</HeaderLink>
					<Ul>
						<Li key="list-item-développeur-api">
							<Link to={absoluteSitePaths.développeur.api}>
								API REST de simulation
							</Link>
						</Li>
						<Li key="list-item-développeur-iframe">
							<Link to={absoluteSitePaths.développeur.iframe}>
								Intégrer le module Web
							</Link>
						</Li>
						<Li key="list-item-développeur-library">
							<Link to={absoluteSitePaths.développeur.library}>
								Utiliser les calculs des simulateurs dans votre application
							</Link>
						</Li>
						<Li key="list-item-développeur-library">
							<Link to={absoluteSitePaths.développeur.spreadsheet}>
								Utiliser avec un tableur
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.documentation.index}>Documentation</Link>
				</Li>
			</StyledUl>
		</Trans>
	)
}

const HeaderLink = styled(Link)`
	${({ theme }) => `margin-bottom: ${theme.spacings.xs}`};
	display: inline-block;
`

const StyledUl = styled.ul`
	padding-left: 0;
`
