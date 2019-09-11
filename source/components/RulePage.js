import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { encodeRuleName } from 'Engine/rules'
import {
	decodeRuleName,
	findRuleByDottedName,
	findRulesByName
} from 'Engine/rules.js'
import { compose, head } from 'ramda'
import React, { createContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import {
	flatRulesSelector,
	noUserInputSelector,
	situationBranchNameSelector
} from 'Selectors/analyseSelectors'
import { capitalise0 } from '../utils'
import Namespace from './rule/Namespace'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'

export const SkipTrivialRuleContext = createContext(false)

export default compose(
	connect(state => ({
		valuesToShow: !noUserInputSelector(state),
		flatRules: flatRulesSelector(state),
		brancheName: situationBranchNameSelector(state)
	}))
)(function RulePage({ flatRules, match, location, valuesToShow, brancheName }) {
	let name = match?.params?.name,
		decodedRuleName = decodeRuleName(name)

	const renderRule = dottedName => {
		const skipTrivialRule = Boolean(location?.state?.skipTrivialRule)
		return (
			<div id="RulePage">
				<ScrollToTop key={brancheName + dottedName} />
				<div className="rule-page__header">
					{valuesToShow ? <BackToSimulation /> : <span />}
					{brancheName && <span id="situationBranch">{brancheName}</span>}
					<SearchButton />
				</div>
				<SkipTrivialRuleContext.Provider value={skipTrivialRule}>
					<Rule dottedName={dottedName} />
				</SkipTrivialRuleContext.Provider>
			</div>
		)
	}

	if (decodedRuleName.includes(' . ')) {
		if (!findRuleByDottedName(flatRules, decodedRuleName))
			return <Redirect to="/404" />

		return renderRule(decodedRuleName)
	}

	let rules = findRulesByName(flatRules, decodedRuleName)
	if (!rules.length) return <Redirect to="/404" />
	if (rules.find(({ ns }) => ns == null)) return renderRule(decodedRuleName)
	if (rules.length > 1)
		return (
			<DisambiguateRuleQuery rules={rules} flatRules={flatRules} name={name} />
		)
	let dottedName = head(rules).dottedName
	return renderRule(dottedName)
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

let DisambiguateRuleQuery = ({ rules, flatRules, name }) => (
	<div className="centeredMessage ui__ container">
		<h1>{capitalise0(name)}</h1>
		<p>
			<Trans i18nKey="ambiguous">
				Plusieurs règles de la base ont ce nom. Laquelle voulez-vous afficher ?
			</Trans>
		</p>
		<ul>
			{rules.map(({ dottedName, ns, title }) => (
				<li key={dottedName}>
					<Namespace ns={ns} flatRules={flatRules} />
					<Link to={'' + encodeRuleName(dottedName)}>{title}</Link>
				</li>
			))}
		</ul>
	</div>
)
