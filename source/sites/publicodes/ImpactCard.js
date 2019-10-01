import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import {
	analysisWithDefaultsSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import { StoreContext } from './StoreContext'
import ItemCard from './ItemCard'

export default compose(
	connect(state => ({
		analysis: analysisWithDefaultsSelector(state),
		nextSteps: nextStepsSelector(state)
	})),
	withColours
)(({ analysis: { targets }, nextSteps }) => {
	let { state } = useContext(StoreContext)

	return (
		<div css="display: flex;    justify-content: center;">
			<ItemCard
				{...targets[0]}
				showHumanCarbon
				scenario={state.scenario}
				showCarbon={!nextSteps.length}
			/>
		</div>
	)
})
