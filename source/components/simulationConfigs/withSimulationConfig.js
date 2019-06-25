import { resetSimulation, setSimulationConfig } from 'Actions/actions'
import { compose, isEmpty, isNil, path } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { change, formValueSelector, getFormMeta, reduxForm } from 'redux-form'
import { createSelector } from 'reselect'
import {
	analysisWithDefaultsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'

// Initialize defaultValue for target that can't be computed
const targetsWithDefaultValueSelector = createSelector(
	analysisWithDefaultsSelector,
	analysis => {
		const targets = analysis?.targets
		if (!targets) {
			return []
		}
		return targets.filter(
			target =>
				(!target.formule || isEmpty(target.formule)) &&
				(!isNil(target.defaultValue) ||
					!isNil(target.explanation?.defaultValue))
		)
	}
)

export default config => SimulationComponent =>
	compose(
		reduxForm({
			form: 'conversation',
			destroyOnUnmount: false
		}),
		connect(
			state => ({
				isTargetEmpty: ({ dottedName }) =>
					isNil(formValueSelector('conversation')(state, dottedName)) &&
					!path(
						[...dottedName.split('.'), 'active'],
						getFormMeta('conversation')(state)
					),
				config: state.simulation?.config,
				noUserInput: noUserInputSelector(state),
				analysis: analysisWithDefaultsSelector(state),
				targetsWithDefault: targetsWithDefaultValueSelector(state)
			}),
			{
				setFormValue: (field, value) => dispatch =>
					dispatch(change('conversation', field, '' + value)),
				setSimulationConfig,
				resetSimulation
			}
		),
		withRouter
	)(
		class DecoratedSimulation extends React.Component {
			constructor(props) {
				super(props)
				if (config === props.config) {
					return
				}
				props.setSimulationConfig(config)

				if (props.config) {
					props.resetSimulation()
				}
			}

			componentDidUpdate() {
				this.props.targetsWithDefault
					.filter(this.props.isTargetEmpty)
					.forEach(({ dottedName, defaultValue, explanation }) => {
						this.props.setFormValue(
							dottedName,
							!isNil(defaultValue) ? defaultValue : explanation?.defaultValue
						)
					})
			}
			render() {
				if (!this.props.config) return null
				return <SimulationComponent {...this.props} />
			}
		}
	)
