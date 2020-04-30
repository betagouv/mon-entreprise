import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { decodeRuleName } from 'Engine/ruleUtils'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { connect, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { DottedName } from 'Rules'

import Rule from './Documentation/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'
import { EngineContext } from './utils/EngineContext'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'

export default function RulePage() {
	const parsedRules = useContext(EngineContext).getParsedRules()
	const valuesToShow = useSelector(firstStepCompletedSelector)
	const { name } = useParams()
	const decodedRuleName = decodeRuleName(name ?? '')

	const renderRule = (dottedName: DottedName) => {
		return (
			<div id="RulePage">
				<ScrollToTop key={dottedName} />
				<div className="rule-page__header">
					{valuesToShow ? <BackToSimulation /> : <span />}
					<SearchButton />
				</div>
				<Rule dottedName={dottedName} />
			</div>
		)
	}

	if (!(decodedRuleName in parsedRules)) return <Redirect to="/404" />

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
