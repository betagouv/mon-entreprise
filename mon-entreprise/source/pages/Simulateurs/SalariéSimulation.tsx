import Banner from 'Components/Banner'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import Simulation from 'Components/Simulation'
import SalaryExplanation from 'Components/simulationExplanation/SalaryExplanation'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function SalariéSimulation() {
	const sitePaths = useContext(SitePathsContext)
	const { language } = useTranslation().i18n

	return (
		<>
			<p className="ui__ notice">
				<Trans>
					<strong>
						<Emoji emoji="🙈" /> Erratum du 19/01/21 :{' '}
					</strong>{' '}
					Depuis deux semaines, les simulations donnaient un montant trop élevé
					pour le coût total employeur. C'est maintenant corrigé. Veuillez nous
					excuser pour la gêne occasionnée.
				</Trans>
			</p>
			<Simulation
				explanations={<SalaryExplanation />}
				showLinkToForm={language === 'fr'}
				customEndMessages={
					<>
						<Trans i18nKey="simulation-end.hiring.text">
							Vous pouvez maintenant concrétiser votre projet d'embauche.
						</Trans>
						<div style={{ textAlign: 'center', margin: '1rem' }}>
							<Link
								className="ui__ plain button"
								to={sitePaths.gérer.embaucher}
							>
								<Trans i18nKey="simulation-end.cta">
									Connaître les démarches
								</Trans>
							</Link>
						</div>
					</>
				}
			/>
			<br />

			{/** L'équipe Code Du Travail Numérique ne souhaite pas référencer
			 * le simulateur dirigeant de SASU sur son site. */}
			{!document.referrer?.includes('code.travail.gouv.fr') && (
				<Banner icon={'👨‍✈️'}>
					<Trans>
						Vous êtes dirigeant d'une SAS(U) ?{' '}
						<Link to={sitePaths.simulateurs.SASU}>
							Accéder au simulateur de revenu dédié
						</Link>
					</Trans>
				</Banner>
			)}
		</>
	)
}
