import Banner from 'Components/Banner'
import { useState } from 'react'
import Simulation from 'Components/Simulation'
import SalaryExplanation from 'Components/simulationExplanation/SalaryExplanation'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function SalariéSimulation() {
	const [animationDisabled, setAnimationDisabled] = useState(false);
	const sitePaths = useContext(SitePathsContext)

	return (
		<>
			<Simulation
				userWillExport={()=>{setAnimationDisabled(true)}}
				disableAnimation={animationDisabled}
				explanations={<SalaryExplanation disableAnimation={animationDisabled}/>}
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
						<Link to={sitePaths.simulateurs.sasu}>
							Accéder au simulateur de revenu dédié
						</Link>
					</Trans>
				</Banner>
			)}
		</>
	)
}
