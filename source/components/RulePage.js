import { setExample } from 'Actions/actions'
import { encodeRuleName } from 'Engine/rules'
import {
	decodeRuleName,
	findRuleByDottedName,
	findRulesByName
} from 'Engine/rules.js'
import { compose, head, path } from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import {
	flatRulesSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import Namespace from './rule/Namespace'
import Rule from './rule/Rule'
import './RulePage.css'
import SearchButton from './SearchButton'
@connect(state => ({
	themeColours: state.themeColours,
	valuesToShow: !noUserInputSelector(state),
	flatRules: flatRulesSelector(state)
}))
@translate()
export default class RulePage extends Component {
	componentDidMount() {
		animateScroll.scrollToTop({ duration: 300 })
	}
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
		if (rules.length > 1)
			return <DisambiguateRuleQuery rules={rules} flatRules={flatRules} />
		let dottedName = head(rules).dottedName
		return this.renderRule(dottedName)
	}
	renderRule(dottedName) {
		return (
			<div id="RulePage" className="ui__ container">
				<div className="rule-page__header">
					{!this.props.noUserInputSelector && (
						<BackToSimulation colour={this.props.themeColours.colour} />
					)}
					<SearchButton
						className="rule-page__search"
						rulePageBasePath="../règle"
					/>
				</div>
				<Rule dottedName={dottedName} />
			</div>
		)
	}
}

@connect(
	null,
	dispatch => ({
		setExample: compose(
			dispatch,
			setExample
		)
	})
)
@withRouter
@translate() // Triggers rerender when the language changes
class BackToSimulation extends Component {
	render() {
		let { colour, setExample } = this.props
		return (
			<Link
				id="toSimulation"
				to=".."
				onClick={() => {
					setExample(null)
				}}
				style={{ background: colour }}>
				⬅️ <Trans i18nKey="back">Reprendre la simulation</Trans>
			</Link>
		)
	}
}

let DisambiguateRuleQuery = ({ rules, flatRules }) => (
	<div className="centeredMessage">
		<p>
			<Trans i18nKey="ambiguous">
				Plusieurs règles de la base ont ce nom. Laquelle voulez-vous afficher ?
			</Trans>
		</p>
		<ul>
			{rules.map(({ dottedName, ns, title }) => (
				<li key={dottedName}>
					<Namespace ns={ns} flatRules={flatRules} />
					<Link to={'../règle/' + encodeRuleName(dottedName)}>{title}</Link>
				</li>
			))}
		</ul>
	</div>
)
