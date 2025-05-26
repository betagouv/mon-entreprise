import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import { TrackPage } from '../components/ATInternetTracking'
import Meta from '../components/utils/Meta'

export default function Plan() {
	const { t } = useTranslation()

	return (
		<>
			<H1>
				<Trans i18nKey={'sitemap.title'}>Plan du site</Trans>
			</H1>
			<Meta
				title={t('sitemap.title', 'Plan du site')}
				description={t(
					'sitemap.description',
					"Page détaillant l'arborescence du site Mon-Entreprise."
				)}
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />

			<Ul size="XL" $noMarker>
				<PlanContent />
			</Ul>
		</>
	)
}

export const PlanContent = () => {
	const { absoluteSitePaths } = useSitePaths()
	const simulatorData = useSimulatorsData()

	return (
		<>
			<Li>
				<Link to={absoluteSitePaths.index}>
					<Trans>Page d'accueil</Trans>
				</Link>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.nouveautés.index}>
					<Trans>Nouveautés</Trans>
				</Link>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.simulateursEtAssistants}>
					<Trans>Simulateurs et Assistants</Trans>
				</Link>

				<StyledUl>
					{Object.entries(simulatorData)
						.filter(
							([, simulator]) =>
								simulator.pathId.startsWith('simulateurs') &&
								!simulator.pathId.startsWith('simulateurs.profession-libérale.cipav') &&
								!simulator.pathId.startsWith(
									'simulateurs.profession-libérale.auxiliaire'
								) &&
								!simulator.pathId.startsWith(
									'simulateurs.profession-libérale.chirurgien-dentiste'
								) &&
								!simulator.pathId.startsWith('simulateurs.profession-libérale.médecin') &&
								!simulator.pathId.startsWith(
									'simulateurs.profession-libérale.sage-femme'
								) &&
								!('hidden' in simulator && simulator.hidden)
						)
						.map(([simulateurKey, { path, title }]) => {
							return (
								<Li key={`list-item-${simulateurKey}`}>
									<Link to={path}>{title}</Link>
								</Li>
							)
						})}

					{Object.entries(simulatorData)
						.filter(
							([, simulator]) =>
								simulator.pathId.startsWith('assistants') &&
								simulator.pathId !== 'assistants.pour-mon-entreprise.index' &&
								!('hidden' in simulator && simulator.hidden)
						)
						.map(([simulateurKey, { path, title }]) => {
							return (
								<Li key={`list-item-${simulateurKey}`}>
									<Link to={path}>{title}</Link>
								</Li>
							)
						})
						.reverse()}
				</StyledUl>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.documentation.index}>
					<Trans>Documentation</Trans>
				</Link>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.développeur.index}>
					<Trans>Outils pour les développeurs</Trans>
				</Link>

				<StyledUl>
					<Li>
						<Link to={absoluteSitePaths.développeur.iframe}>
							<Trans>Intégrer le module Web</Trans>
						</Link>
					</Li>

					<Li>
						<Link to={absoluteSitePaths.développeur.api}>
							<Trans>API REST de simulation</Trans>
						</Link>
					</Li>

					<Li>
						<Link to={absoluteSitePaths.développeur.spreadsheet}>
							<Trans>Utiliser avec un tableur</Trans>
						</Link>
					</Li>

					<Li>
						<Link to={absoluteSitePaths.développeur.library}>
							<Trans>
								Utiliser les calculs des simulateurs dans votre application
							</Trans>
						</Link>
					</Li>
				</StyledUl>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.accessibilité}>
					<Trans>Accessibilité</Trans>
				</Link>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.stats}>
					<Trans>Statistiques</Trans>
				</Link>
			</Li>

			<Li>
				<Link to={absoluteSitePaths.budget}>
					<Trans>Budget</Trans>
				</Link>
			</Li>
		</>
	)
}

const StyledUl = styled(Ul)`
	margin-top: ${({ theme }) => theme.spacings.xs};
`
