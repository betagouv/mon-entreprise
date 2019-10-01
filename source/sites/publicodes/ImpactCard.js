import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { StoreContext } from './StoreContext'
import HumanCarbonImpact from './HumanCarbonImpact'
import CarbonImpact from './CarbonImpact'

export default compose(
	connect(state => ({ analysis: analysisWithDefaultsSelector(state) })),
	withColours
)(({ analysis: { targets } }) => {
	let { state } = useContext(StoreContext)
	let { nodeValue, dottedName, formule } = targets[0]

	return (
		<div
			css={`
				margin: 5rem auto 2rem;
				text-align: center;
			`}>
			<HumanCarbonImpact nodeValue={nodeValue} scenario={state.scenario} />
			<CarbonImpact
				nodeValue={nodeValue}
				formule={formule}
				dottedName={dottedName}
			/>
		</div>
	)
})
