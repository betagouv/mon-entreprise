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
		<>
			<H1>
				<Trans>Plan du site</Trans>
			</H1>
			<Meta
				page="plan-du-site"
				title="Plan du site"
				description="Page détaillant l'arborescence du site Mon-Entreprise."
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />

			<StyledUl role="main">
				<Li as="h2">
					<Link to={absoluteSitePaths.index}>
						<Trans>Page d'accueil</Trans>
					</Link>
				</Li>
				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.créer.index}>
						<Trans>Créer une entreprise</Trans>
					</HeaderLink>
					<Ul>
						<Li>
							<Link to={absoluteSitePaths.créer.après}>
								<Trans>Après la création</Trans>
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.créer.guideStatut.index}>
								<Trans>Choix du statut juridique</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>

				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.gérer.index}>
						<Trans>Gérer mon activité</Trans>
					</HeaderLink>
					<Ul>
						<Li>
							<Link to={absoluteSitePaths.gérer.embaucher}>
								<Trans>Embaucher</Trans>
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.gérer.sécuritéSociale}>
								<Trans>Protection sociale</Trans>
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.gérer.déclarationIndépendant.index}>
								<Trans>
									Assistant à la détermination des charges sociales déductibles
								</Trans>
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.gérer.formulaireMobilité}>
								<Trans>Simulateur de demande de mobilité</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.simulateurs.index}>
						<Trans>Simulateurs disponibles</Trans>
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
								<Trans>Assistant au choix du statut juridique</Trans>
							</Link>
						</Li>
						<Li key="list-item-economie-collaborative">
							<Link
								to={absoluteSitePaths.simulateurs.économieCollaborative.index}
							>
								<Trans>
									Assistant à la déclaration des revenus des plateformes en
									ligne
								</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.nouveautés}>
						<Trans>Nouveautés</Trans>
					</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.budget}>
						<Trans>Budget</Trans>
					</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.accessibilité}>
						<Trans>Accessibilité</Trans>
					</Link>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.stats}>
						<Trans>Statistiques</Trans>
					</Link>
				</Li>
				<Li as="h2">
					<HeaderLink to={absoluteSitePaths.développeur.index}>
						<Trans>Outils pour les développeurs</Trans>
					</HeaderLink>
					<Ul>
						<Li key="list-item-développeur-api">
							<Link to={absoluteSitePaths.développeur.api}>
								<Trans>API REST de simulation</Trans>
							</Link>
						</Li>
						<Li key="list-item-développeur-iframe">
							<Link to={absoluteSitePaths.développeur.iframe}>
								<Trans>Intégrer le module Web</Trans>
							</Link>
						</Li>
						<Li key="list-item-développeur-library">
							<Link to={absoluteSitePaths.développeur.library}>
								<Trans>
									Utiliser les calculs des simulateurs dans votre application
								</Trans>
							</Link>
						</Li>
						<Li key="list-item-développeur-library">
							<Link to={absoluteSitePaths.développeur.spreadsheet}>
								<Trans>Utiliser avec un tableur</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li as="h2">
					<Link to={absoluteSitePaths.documentation.index}>
						<Trans>Documentation</Trans>
					</Link>
				</Li>
			</StyledUl>
		</>
	)
}

const HeaderLink = styled(Link)`
	${({ theme }) => `margin-bottom: ${theme.spacings.xs}`};
	display: inline-block;
`

const StyledUl = styled.ul`
	padding-left: 0;
`
