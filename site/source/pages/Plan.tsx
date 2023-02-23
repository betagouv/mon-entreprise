import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { H1, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import { TrackPage } from '../components/ATInternetTracking'
import Meta from '../components/utils/Meta'

export default function Plan() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()
	const simulatorData = useSimulatorsData()

	return (
		<>
			<H1>
				<Trans i18nKey={'sitemap.title'}>Plan du site</Trans>
			</H1>
			<Meta
				page="plan-du-site"
				title={t('sitemap.title', 'Plan du site')}
				description={t(
					'sitemap.description',
					"Page détaillant l'arborescence du site Mon-Entreprise."
				)}
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />

			<StyledUl>
				<Li>
					<H3 as="h2">
						<Link to={absoluteSitePaths.index}>
							<Trans>Page d'accueil</Trans>
						</Link>
					</H3>
				</Li>
				<Li>
					<H3 as="h2">
						<HeaderLink to={absoluteSitePaths.créer.index}>
							<Trans>Créer une entreprise</Trans>
						</HeaderLink>
					</H3>

					<Ul>
						<Li>
							<H3 as="h2">
								<Link to={absoluteSitePaths.créer.après}>
									<Trans>Après la création</Trans>
								</Link>
							</H3>
						</Li>
						<Li>
							<H3 as="h2">
								<Link to={absoluteSitePaths.créer.guideStatut.index}>
									<Trans>Choix du statut juridique</Trans>
								</Link>
							</H3>
						</Li>
					</Ul>
				</Li>
				<Li>
					<H3 as="h2">
						<HeaderLink to={absoluteSitePaths.gérer.index}>
							<Trans>Gérer mon activité</Trans>
						</HeaderLink>
					</H3>

					<Ul>
						<Li>
							<H3>
								<Link to={absoluteSitePaths.gérer.embaucher}>
									<Trans>Embaucher</Trans>
								</Link>
							</H3>
						</Li>
						<Li>
							<H3>
								<Link to={absoluteSitePaths.gérer.sécuritéSociale}>
									<Trans>Protection sociale</Trans>
								</Link>
							</H3>
						</Li>
						<Li>
							<H3>
								<Link to={absoluteSitePaths.gérer.déclarationIndépendant.index}>
									<Trans>
										Assistant à la détermination des charges sociales
										déductibles
									</Trans>
								</Link>
							</H3>
						</Li>
						<Li>
							<H3>
								<Link to={absoluteSitePaths.gérer.formulaireMobilité}>
									<Trans>Demande de mobilité internationale</Trans>
								</Link>
							</H3>
						</Li>
					</Ul>
				</Li>
				<Li>
					<H3 as="h2">
						<HeaderLink to={absoluteSitePaths.simulateurs.index}>
							<Trans>Simulateurs disponibles</Trans>
						</HeaderLink>
					</H3>

					<Ul>
						{Object.entries(absoluteSitePaths.simulateurs)
							.filter(([key]) => key in simulatorData)
							.map(([simulateurKey, simulateurPath]: [string, string]) => {
								return (
									<Li key={`list-item-${simulateurKey}`}>
										<H3>
											<Link to={simulateurPath}>
												{
													simulatorData[
														simulateurKey as keyof typeof simulatorData
													].title
												}
											</Link>
										</H3>
									</Li>
								)
							})}
						<Li key="list-item-comparaison">
							<H3>
								<Link to={absoluteSitePaths.simulateurs.comparaison}>
									<Trans>Assistant au choix du statut juridique</Trans>
								</Link>
							</H3>
						</Li>
						<Li key="list-item-economie-collaborative">
							<H3>
								<Link
									to={absoluteSitePaths.simulateurs.économieCollaborative.index}
								>
									<Trans>
										Assistant à la déclaration des revenus des plateformes en
										ligne
									</Trans>
								</Link>
							</H3>
						</Li>
					</Ul>
				</Li>
				<Li>
					<H3 as="h2">
						<Link to={absoluteSitePaths.nouveautés}>
							<Trans>Nouveautés</Trans>
						</Link>
					</H3>
				</Li>

				<Li>
					<H3 as="h2">
						<Link to={absoluteSitePaths.budget}>
							<Trans>Budget</Trans>
						</Link>
					</H3>
				</Li>
				<Li>
					<H3 as="h2">
						<Link to={absoluteSitePaths.accessibilité}>
							<Trans>Accessibilité</Trans>
						</Link>
					</H3>
				</Li>
				<Li>
					<H3 as="h2">
						<Link to={absoluteSitePaths.stats}>
							<Trans>Statistiques</Trans>
						</Link>
					</H3>
				</Li>
				<Li>
					<H3 as="h2">
						<HeaderLink to={absoluteSitePaths.développeur.index}>
							<Trans>Outils pour les développeurs</Trans>
						</HeaderLink>
					</H3>

					<Ul>
						<Li key="list-item-développeur-api">
							<H3>
								<Link to={absoluteSitePaths.développeur.api}>
									<Trans>API REST de simulation</Trans>
								</Link>
							</H3>
						</Li>
						<Li key="list-item-développeur-iframe">
							<H3>
								<Link to={absoluteSitePaths.développeur.iframe}>
									<Trans>Intégrer le module Web</Trans>
								</Link>
							</H3>
						</Li>
						<Li key="list-item-développeur-library">
							<H3>
								<Link to={absoluteSitePaths.développeur.library}>
									<Trans>
										Utiliser les calculs des simulateurs dans votre application
									</Trans>
								</Link>
							</H3>
						</Li>
						<Li key="list-item-développeur-spreadsheet">
							<H3>
								<Link to={absoluteSitePaths.développeur.spreadsheet}>
									<Trans>Utiliser avec un tableur</Trans>
								</Link>
							</H3>
						</Li>
					</Ul>
				</Li>

				<Li>
					<H3 as="h2">
						<Link to={absoluteSitePaths.documentation.index}>
							<Trans>Documentation</Trans>
						</Link>
					</H3>
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
