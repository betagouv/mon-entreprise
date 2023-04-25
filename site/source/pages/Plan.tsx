import { Trans, useTranslation } from 'react-i18next'

import { H1 } from '@/design-system/typography/heading'
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
				title={t('sitemap.title', 'Plan du site')}
				description={t(
					'sitemap.description',
					"Page détaillant l'arborescence du site Mon-Entreprise."
				)}
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />

			<Ul size="XL" noMarker>
				<Li>
					<Link to={absoluteSitePaths.index}>
						<Trans>Page d'accueil</Trans>
					</Link>
				</Li>
				<Li>
					<Link to={absoluteSitePaths.assistants['choix-du-statut'].index}>
						<Trans>Créer une entreprise</Trans>
					</Link>

					<Ul>
						<Li>
							<Link to={absoluteSitePaths.assistants['choix-du-statut'].après}>
								<Trans>Après la création</Trans>
							</Link>
						</Li>
						<Li>
							<Link
								to={
									absoluteSitePaths.assistants['choix-du-statut'].guideStatut
										.index
								}
							>
								<Trans>Choix du statut juridique</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li>
					<Link to={absoluteSitePaths.assistants.index}>
						<Trans>Gérer mon activité</Trans>
					</Link>

					<Ul>
						<Li>
							<Link to={absoluteSitePaths.assistants.embaucher}>
								<Trans>Embaucher</Trans>
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.assistants.sécuritéSociale}>
								<Trans>Protection sociale</Trans>
							</Link>
						</Li>
						<Li>
							<Link
								to={
									absoluteSitePaths.assistants[
										'déclaration-charges-sociales-indépendant'
									]
								}
							>
								<Trans>
									Assistant à la détermination des charges sociales déductibles
								</Trans>
							</Link>
						</Li>
						<Li>
							<Link to={absoluteSitePaths.assistants.formulaireMobilité}>
								<Trans>Demande de mobilité internationale</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li>
					<Link to={absoluteSitePaths.simulateurs.index}>
						<Trans>Simulateurs disponibles</Trans>
					</Link>

					<Ul>
						{Object.entries(absoluteSitePaths.simulateurs)
							.filter(([key]) => key in simulatorData)
							.map(([simulateurKey, simulateurPath]: [string, string]) => {
								return (
									<Li key={`list-item-${simulateurKey}`}>
										<Link to={simulateurPath}>
											{
												simulatorData[
													simulateurKey as keyof typeof simulatorData
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
								to={absoluteSitePaths.assistants.économieCollaborative.index}
							>
								<Trans>
									Assistant à la déclaration des revenus des plateformes en
									ligne
								</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>
				<Li>
					<Link to={absoluteSitePaths.nouveautés}>
						<Trans>Nouveautés</Trans>
					</Link>
				</Li>

				<Li>
					<Link to={absoluteSitePaths.budget}>
						<Trans>Budget</Trans>
					</Link>
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
					<Link to={absoluteSitePaths.développeur.index}>
						<Trans>Outils pour les développeurs</Trans>
					</Link>

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
						<Li key="list-item-développeur-spreadsheet">
							<Link to={absoluteSitePaths.développeur.spreadsheet}>
								<Trans>Utiliser avec un tableur</Trans>
							</Link>
						</Li>
					</Ul>
				</Li>

				<Li>
					<Link to={absoluteSitePaths.documentation.index}>
						<Trans>Documentation</Trans>
					</Link>
				</Li>
			</Ul>
		</>
	)
}
