import { resetSimulation, setSimulationConfig } from 'Actions/actions'
import React from 'react'
import { connect } from 'react-redux'
import { noUserInputSelector } from 'Selectors/analyseSelectors'

export default config => SimulationComponent =>
	connect(
		state => ({
			config: state.simulation?.config,
			noUserInput: noUserInputSelector(state)
		}),
		{
			setSimulationConfig,
			resetSimulation
		}
	)(
		class DecoratedSimulation extends React.Component {
			constructor(props) {
				super(props)
				if (config !== props.config) {
					props.setSimulationConfig(config)
					if (props.config) {
						props.resetSimulation()
					}
				}
			}
			render() {
				if (!this.props.config) return null
				return <SimulationComponent {...this.props} />
			}
		}
	)
