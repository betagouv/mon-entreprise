import { Trans, useTranslation } from 'react-i18next'

import AvertissementRéformeRGDUNonImplémentée from '@/components/AvertissementRéformeRGDUNonImplémentée'
import { WhenNotAlreadyDefined } from '@/components/EngineValue/WhenNotAlreadyDefined'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { FadeIn } from '@/components/ui/animate'
import BrowserOnly from '@/components/utils/BrowserOnly'
import { Body, Emoji, Link, Message, SmallBody } from '@/design-system'
import ExplicationsSalaire from '@/pages/simulateurs/salarié/components/Explications'
import { useSitePaths } from '@/sitePaths'

import SalariéSimulationGoals from './Goals'

export default function SalariéSimulation() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Simulation
				explanations={<ExplicationsSalaire />}
				customEndMessages={t(
					'simulation-end.hiring.text',
					'Vous pouvez maintenant concrétiser votre projet d’embauche.'
				)}
				afterQuestionsSlot={
					<BrowserOnly>
						{/** L'équipe Code Du Travail Numérique ne souhaite pas référencer
						 * le simulateur dirigeant de SASU sur son site. */}
						{!import.meta.env.SSR &&
							!document.referrer?.includes('code.travail.gouv.fr') && (
								<WhenNotAlreadyDefined dottedName="entreprise . catégorie juridique">
									<FadeIn>
										<Message
											border={false}
											mini
											icon={<Emoji emoji="👨‍✈️" />}
											className="print-hidden"
										>
											<SmallBody>
												<Trans i18nKey="pages.simulateurs.salarié.SASU">
													Vous êtes dirigeant d'une SAS(U) ?{' '}
													<Link to={absoluteSitePaths.simulateurs.sasu}>
														Accédez au simulateur de revenu dédié
													</Link>
												</Trans>
											</SmallBody>
										</Message>
									</FadeIn>
								</WhenNotAlreadyDefined>
							)}
					</BrowserOnly>
				}
			>
				<SimulateurWarning
					simulateur="salarié"
					informationsComplémentaires={
						<>
							<AvertissementRéformeRGDUNonImplémentée />
							<Body>
								<Trans i18nKey="pages.simulateurs.salarié.warning.général">
									Le simulateur ne prend pour l’instant pas en compte les
									accords et conventions collectives, ni la myriade d’aides aux
									entreprises. Trouvez votre convention collective{' '}
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
						</>
					}
				/>
				<SalariéSimulationGoals />
			</Simulation>
		</>
	)
}
