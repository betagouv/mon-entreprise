import ComparativeSimulation from 'Components/ComparativeSimulation'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import config from 'Components/simulationConfigs/rémunération-dirigeant.yaml'

export default connect(
	state => ({ simulationConfig: state.simulationConfig }),
	dispatch => ({
		setSimulation: () => dispatch({ type: 'SET_SIMULATION_CONFIG', config })
	})
)(
	class SchemeComparaisonPage extends React.Component {
		componentDidMount() {
			this.props.setSimulation()
		}
		render() {
			if (!this.props.simulationConfig) return null
			return (
				<>
					<Helmet>
						<title>
							Assimilé salarié, indépendant, micro-entreprise : comparaison des
							différents régimes
						</title>
					</Helmet>
					<h1>Comparaison des différents régimes de cotisation</h1>
					<ComparativeSimulation config={this.props.simulationConfig} />
				</>
			)
		}
	}
)
