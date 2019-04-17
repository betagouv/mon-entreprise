import Banner from 'Components/Banner'
import React from 'react'
import { connect } from 'react-redux'
import SalariéSimulation from '../SocialSecurity/Salarié'
export default connect(state => ({
	showMonEntrepriseLink: !state.conversationStarted
}))(function IframeSimulateurEmbauche({ showMonEntrepriseLink }) {
	return (
		<>
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
			<SalariéSimulation />
		</>
	)
})
