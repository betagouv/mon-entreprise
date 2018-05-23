import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { analyse } from 'Engine/traverse'
import { head, path, compose } from 'ramda'
import {
	decodeRuleName,
	nameLeaf,
	findRulesByName,
	findRuleByDottedName
} from 'Engine/rules.js'
import { encodeRuleName } from 'Engine/rules'
import { pipe, pluck, join, map, pick } from 'ramda'
import { Link, Redirect } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import './RulePage.css'
import SearchButton from './SearchButton'
import Namespace from './rule/Namespace'
import Rule from './rule/Rule'
import { setExample } from '../actions'

@translate()
@connect(pick(['situationGate', 'parsedRules', 'analysis', 'themeColours']))
export default class RulePage extends Component {
	nameFromParams = path(['match', 'params', 'name'])
	componentWillMount() {
		this.setRule(this.nameFromParams(this.props))
	}
	componentDidMount() {
		animateScroll.scrollToTop({ duration: 300 })
	}
	componentWillReceiveProps(nextProps) {
		if (this.nameFromParams(nextProps) !== this.nameFromParams(this.props)) {
			this.setRule(this.nameFromParams(nextProps))
		}
	}
	setRule(name) {
		let { parsedRules } = this.props,
			decodedRuleName = decodeRuleName(name)

		if (decodedRuleName.includes(' . ')) {
			this.multipleMatchingRules = false
			this.setDottedRule(decodedRuleName)
			return
		}

		let ruleName = nameLeaf(decodeRuleName(name)),
			rules = findRulesByName(parsedRules, ruleName)
		if (!rules.length) return null
		if (rules.length > 1) this.multipleMatchingRules = rules
		let dottedName = head(rules).dottedName
		this.setDottedRule(dottedName)
	}
	setDottedRule(dottedName) {
		let { parsedRules, situationGate } = this.props,
			rule = findRuleByDottedName(parsedRules, dottedName)
		if (!rule) return null
		this.rule = head(
			analyse(parsedRules, rule.dottedName)(situationGate).targets
		)
	}
	render() {
		if (this.multipleMatchingRules)
			return <DisambiguateRuleQuery rules={this.multipleMatchingRules} />
		if (!this.rule) return <Redirect to="/404" />

		let targets = path(['analysis', 'targets'], this.props)

		return (
			<div id="RulePage">
				{targets && (
					<BackToSimulation
						colour={this.props.themeColours.colour}
						targets={targets}
					/>
				)}
				<SearchButton />
				<Rule rule={this.rule} />
			</div>
		)
	}
}

@connect(null, dispatch => ({
	setExample: compose(dispatch, setExample)
}))
class BackToSimulation extends Component {
	render() {
		let { targets, colour, setExample } = this.props
		return (
			<Link
				onClick={() => setExample(null)}
				id="toSimulation"
				to={
					'/simu/' +
					pipe(pluck('name'), map(encodeRuleName), join('+'))(targets)
				}
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
