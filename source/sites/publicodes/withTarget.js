import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import {
	analysisWithDefaultsSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import { StoreContext } from './StoreContext'

export default Component =>
	compose(
		connect(state => ({
			analysis: analysisWithDefaultsSelector(state),
			foldedSteps: state.conversationSteps.foldedSteps,
			nextSteps: nextStepsSelector(state)
		})),
		withColours
	)(({ analysis: { targets }, nextSteps, foldedSteps }) => {
		let { state } = useContext(StoreContext)

		return (
			<div css="display: flex;    justify-content: center;">
				<Component
					{...targets[0]}
					showHumanCarbon
					scenario={state.scenario}
					nextSteps={nextSteps}
					foldedSteps={foldedSteps}
				/>
			</div>
		)
	})
