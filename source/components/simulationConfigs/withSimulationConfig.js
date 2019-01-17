import { resetSimulation, setSimulationConfig } from 'Actions/actions'
import React from 'react'
import { connect } from 'react-redux'

export default config => SimulationComponent =>
	connect(
		state => ({ simulationConfig: state.simulationConfig }),
		{
			setSimulationConfig,
			resetSimulation
		}
	)(
		class DecoratedSimulation extends React.Component {
			componentDidMount() {
				if (config !== this.props.simulationConfig) {
					this.props.resetSimulation()
					this.props.setSimulationConfig(config)
				}
			}
			render() {
				if (!this.props.simulationConfig) return null
				return <SimulationComponent />
			}
		}
	)
