import { React, T } from 'Components'
import Banner from 'Components/Banner'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import SalaryExplanation from 'Components/SalaryExplanation'
import Simulation from 'Components/Simulation'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default withTranslation()(function Salarié({ t }) {
	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.salarié.page.titre',
						`Calcul du salaire net et brut : simulateur officiel`
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.salarié.page.description',
						'Estimez les cotisations pour un salarié à partir du salaire brut, net ou "superbrut". Prise en comptes de toutes les cotisations du régime général et de l\'impôt sur le revenu. Découvrez les contreparties garanties par sécurité sociale'
					)}
				/>
			</Helmet>
			<h1>Simulateur de revenus pour salarié</h1>
			<div style={{ margin: '2rem' }} />
			<Banner icon="✨">
				Le simulateur d'embauche évolue et devient{' '}
				<strong>mon-entreprise.fr !</strong>{' '}
				<a href="https://pad.etalab.studio/s/By2X4Z2rV#">
					Lire nos explications
				</a>
			</Banner>
			<SalarySimulation />
		</>
	)
})

export let SalarySimulation = compose(
	withSimulationConfig(salariéConfig),
	withSitePaths
)(({ sitePaths }) => (
	<>
		<Simulation
			explanations={
				<SalaryExplanation
					protectionText={
						<p className="ui__ notice">
							{emoji('☂️')}{' '}
							<T k="simulateurs.salarié.description">
								Dès que l'embauche d'un salarié est déclarée et qu'il est payé,
								il est couvert par le régime général de la Sécurité sociale
								(santé, maternité, invalidité, vieillesse, maladie
								professionnelle et accidents) et chômage.
							</T>
						</p>
					}
				/>
			}
			customEndMessages={
				<>
					<T k="simulation-end.hiring.text">
						Vous pouvez maintenant concrétiser votre projet d'embauche.
					</T>
					{sitePaths.démarcheEmbauche && (
						<div style={{ textAlign: 'center', margin: '1rem' }}>
							<Link
								className="ui__ plain button"
								to={sitePaths.démarcheEmbauche.index}>
								<T k="simulation-end.cta">Connaître les démarches</T>
							</Link>
						</div>
					)}
				</>
			}
		/>
		<PreviousSimulationBanner />
	</>
))
