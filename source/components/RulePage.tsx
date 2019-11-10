import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { decodeRuleName, findRuleByDottedName } from 'Engine/rules.js'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
	flatRulesSelector,
	noUserInputSelector,
	situationBranchNameSelector
} from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'

export default function RulePage({ match }) {
	const flatRules = useSelector(flatRulesSelector)
	const brancheName = useSelector(situationBranchNameSelector)
	const valuesToShow = !useSelector(noUserInputSelector)
	let name = match?.params?.name,
		decodedRuleName = decodeRuleName(name)

	const renderRule = (dottedName: DottedName) => {
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
}

const BackToSimulation = connect(null, { goBackToSimulation })(
	// Triggers rerender when the language changes
	function BackToSimulation({ goBackToSimulation }) {
		return (
			<button
				className="ui__ simple small push-left button"
				onClick={goBackToSimulation}
			>
				← <Trans i18nKey="back">Reprendre la simulation</Trans>
			</button>
		)
	}
)
