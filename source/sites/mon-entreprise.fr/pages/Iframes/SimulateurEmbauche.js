import Banner from 'Components/Banner'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { SalarySimulation } from '../SocialSecurity/Salarié'

export default compose(
	withSitePaths,
	connect(state => ({
		showMonEntrepriseLink: !state.conversationStarted
	})),
	withSimulationConfig(salariéConfig)
)(function IframeSimulateurEmbauche({ showMonEntrepriseLink, sitePaths }) {
	return (
		<>
			<Helmet>
				<link rel="canonical" href={sitePaths.sécuritéSociale.salarié} />
			</Helmet>
			{showMonEntrepriseLink && (
				<Banner icon="✨">
					Dirigeants de société, travailleurs indépendants, ou
					auto-entrepreneurs : calculez vos revenus à l'euro près avec les
					nouveaux simulateurs officiels sur{' '}
					<strong>
						<a target="_parent" href="https://mon-entreprise.fr">
							mon-entreprise.fr
						</a>
					</strong>
				</Banner>
			)}
			<SalarySimulation />
		</>
	)
})
