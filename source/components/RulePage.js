import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { head, path, compose } from 'ramda'
import {
	decodeRuleName,
	findRulesByName,
	findRuleByDottedName
} from 'Engine/rules.js'
import { encodeRuleName } from 'Engine/rules'
import { Link, Redirect } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import './RulePage.css'
import SearchButton from './SearchButton'
import Namespace from './rule/Namespace'
import Rule from './rule/Rule'
import { setExample } from '../actions'
import {
	noUserInputSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'

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
		if (rules.length > 1) return <DisambiguateRuleQuery rules={rules} />
		let dottedName = head(rules).dottedName
		return this.renderRule(dottedName)
	}
	renderRule(dottedName) {
		return (
			<div id="RulePage">
				{!this.props.noUserInputSelector && (
					<BackToSimulation colour={this.props.themeColours.colour} />
				)}
				<SearchButton />
				<Rule dottedName={dottedName} />
			</div>
		)
	}
}

@connect(null, dispatch => ({
	setExample: compose(dispatch, setExample)
}))
class BackToSimulation extends Component {
	render() {
		let { colour, setExample } = this.props
		return (
			<Link
				onClick={() => setExample(null)}
				id="toSimulation"
				to={'/'}
				style={{ background: colour }}>
				<i className="fa fa-arrow-circle-left" aria-hidden="true" />
				<Trans i18nKey="back">Reprendre la simulation</Trans>
			</Link>
		)
	}
}

let DisambiguateRuleQuery = ({ rules }) => (
	<div className="centeredMessage">
		<p>
			<Trans i18nKey="ambiguous">
				Plusieurs règles de la base ont ce nom. Laquelle voulez-vous afficher ?
			</Trans>
		</p>
		<ul>
			{rules.map(({ dottedName, ns, title }) => (
				<li key={dottedName}>
					<Namespace ns={ns} />
					<Link to={'/règle/' + encodeRuleName(dottedName)}>{title}</Link>
				</li>
			))}
		</ul>
	</div>
)
