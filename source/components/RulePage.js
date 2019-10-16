import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import {
	decodeRuleName,
	findRuleByDottedName
} from 'Engine/rules.js'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
	flatRulesSelector,
	noUserInputSelector,
	situationBranchNameSelector
} from 'Selectors/analyseSelectors'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'

export default compose(
	connect(state => ({
		valuesToShow: !noUserInputSelector(state),
		flatRules: flatRulesSelector(state),
		brancheName: situationBranchNameSelector(state)
	}))
)(function RulePage({ flatRules, match, valuesToShow, brancheName }) {
	let name = match?.params?.name,
		decodedRuleName = decodeRuleName(name)

	const renderRule = dottedName => {
		return (
			<div id="RulePage">
				<ScrollToTop key={brancheName + dottedName} />
				<div className="rule-page__header">
					{valuesToShow ? <BackToSimulation /> : <span />}
					{brancheName && <span id="situationBranch">{brancheName}</span>}
					<SearchButton />
				</div>
				<Rule dottedName={dottedName} />
			</div>
		)
	}

	if (!findRuleByDottedName(flatRules, decodedRuleName))
		return <Redirect to="/404" />

	return renderRule(decodedRuleName)
})

const BackToSimulation = compose(
	connect(
		null,
		{ goBackToSimulation }
	)
)(
	// Triggers rerender when the language changes
	function BackToSimulation({ goBackToSimulation }) {
		return (
			<button className="ui__ simple small button" onClick={goBackToSimulation}>
				{emoji('⬅️')} <Trans i18nKey="back">Reprendre la simulation</Trans>
			</button>
		)
	}
)
