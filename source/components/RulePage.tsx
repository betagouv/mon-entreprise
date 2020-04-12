import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { decodeRuleName } from 'Engine/ruleUtils'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { DottedName } from 'Rules'
import {
	noUserInputSelector,
	parsedRulesSelector,
	situationBranchNameSelector
} from 'Selectors/analyseSelectors'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'

export default function RulePage() {
	const parsedRules = useSelector(parsedRulesSelector)
	const brancheName = useSelector(situationBranchNameSelector)
	const valuesToShow = !useSelector(noUserInputSelector)
	const { name } = useParams()
	const decodedRuleName = decodeRuleName(name ?? '')

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

	if (!parsedRules.hasOwnProperty(decodedRuleName))
		return <Redirect to="/404" />

	return renderRule(decodedRuleName as DottedName)
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
