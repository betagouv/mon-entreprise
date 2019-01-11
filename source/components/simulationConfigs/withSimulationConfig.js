import React from 'react'
import { connect } from 'react-redux'

export default config => SimulationComponent =>
	connect(
		state => ({ simulationConfig: state.simulationConfig }),
		dispatch => ({
			setSimulation: () => {
				dispatch({ type: 'SET_SIMULATION_CONFIG', config })
			}
		})
	)(
		class DecoratedSimulation extends React.Component {
			componentDidMount() {
				this.props.setSimulation()
			}
			render() {
				if (!this.props.simulationConfig) return null
				return <SimulationComponent />
			}
		}
	)
