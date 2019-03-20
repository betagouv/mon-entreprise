import { goBackToSimulation } from 'Actions/actions'
import { ScrollToTop } from 'Components/utils/Scroll'
import { encodeRuleName } from 'Engine/rules'
import {
	decodeRuleName,
	findRuleByDottedName,
	findRulesByName
} from 'Engine/rules.js'
import { compose, head, path } from 'ramda'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
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

export default compose(
	connect(state => ({
		valuesToShow: !noUserInputSelector(state),
		flatRules: flatRulesSelector(state),
		brancheName: situationBranchNameSelector(state)
	})),

	withTranslation()
)(
	class RulePage extends Component {
		render() {
			let { flatRules } = this.props,
				name = path(['match', 'params', 'name'], this.props),
				decodedRuleName = decodeRuleName(name)

			if (decodedRuleName.includes(' . ')) {
				if (!findRuleByDottedName(flatRules, decodedRuleName))
					return <Redirect to="/404" />

				return this.renderRule(decodedRuleName)
			}

			let rules = findRulesByName(flatRules, decodedRuleName)
			if (!rules.length) return <Redirect to="/404" />
			if (rules.find(({ ns }) => ns == null))
				return this.renderRule(decodedRuleName)
			if (rules.length > 1)
				return (
					<DisambiguateRuleQuery
						rules={rules}
						flatRules={flatRules}
						name={name}
					/>
				)
			let dottedName = head(rules).dottedName
			return this.renderRule(dottedName)
		}
		renderRule(dottedName) {
			let { brancheName } = this.props
			return (
				<div id="RulePage" className="ui__ container">
					<ScrollToTop key={brancheName + dottedName} />
					<div className="rule-page__header">
						{this.props.valuesToShow ? <BackToSimulation /> : <span />}
						{brancheName && <span id="situationBranch">{brancheName}</span>}
						<SearchButton />
					</div>
					<Rule dottedName={dottedName} />
				</div>
			)
		}
	}
)

const BackToSimulation = compose(
	connect(
		null,
		{ goBackToSimulation }
	),
	withRouter,
	withTranslation()
)(
	// Triggers rerender when the language changes
	class BackToSimulation extends Component {
		render() {
			let { goBackToSimulation } = this.props
			return (
				<button className="ui__ link-button" onClick={goBackToSimulation}>
					{emoji('⬅️')}
					<Trans i18nKey="back">Reprendre la simulation</Trans>
				</button>
			)
		}
	}
)

let DisambiguateRuleQuery = ({ rules, flatRules, name }) => (
	<div className="centeredMessage ui__ container">
		<h1>{capitalise0(name)}</h1>
		<p>
			<Trans i18nKey="ambiguous">
				Plusieurs pages de la documentation ont ce nom. Laquelle voulez-vous
				afficher ?
			</Trans>
		</p>
		<ul>
			{rules.map(({ dottedName, ns, title }) => (
				<li key={dottedName}>
					<Namespace dottedName={dottedName} flatRules={flatRules} />
					<Link to={'' + encodeRuleName(dottedName)}>{title}</Link>
				</li>
			))}
		</ul>
	</div>
)
