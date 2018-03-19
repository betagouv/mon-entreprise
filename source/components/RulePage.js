import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rule from 'Components/rule/Rule'
import { analyse } from 'Engine/traverse'
import { head, path } from 'ramda'
import {
	decodeRuleName,
	nameLeaf,
	findRulesByName,
	findRuleByDottedName
} from 'Engine/rules.js'
import { encodeRuleName } from 'Engine/rules'
import { pipe, pluck, join, map } from 'ramda'
import { Link, Redirect } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import './RulePage.css'
import { Namespace } from './rule/Rule'
import SearchButton from 'Components/SearchButton'

@connect(state => ({
	situationGate: state.situationGate,
	parsedRules: state.parsedRules,
	analysis: state.analysis
}))
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
		let { parsedRules, situationGate } = this.props,
			decodedRuleName = decodeRuleName(name)
		if (decodedRuleName.includes(' . ')) {
			let rule = findRuleByDottedName(parsedRules, decodedRuleName)
			this.rule =
				rule &&
				head(analyse(parsedRules, rule.dottedName)(situationGate).targets)
			this.multipleMatchingRules = false
			return
		}

		let ruleName = nameLeaf(decodeRuleName(name)),
			rules = findRulesByName(parsedRules, ruleName)
		if (!rules.length) return null
		if (rules.length > 1) this.multipleMatchingRules = rules
		this.rule = head(
			analyse(parsedRules, head(rules).dottedName)(situationGate).targets
		)
	}
	render() {
		if (this.multipleMatchingRules)
			return <DisambiguateRuleQuery rules={this.multipleMatchingRules} />
		if (!this.rule) return <Redirect to="/404" />

		let targets = path(['analysis', 'targets'], this.props)

		return (
			<div id="RulePage">
				{targets && <BackToSimulation targets={targets} />}
				<SearchButton />
				<Rule rule={this.rule} />
			</div>
		)
	}
}

let BackToSimulation = ({ targets }) => (
	<Link
		id="toSimulation"
		to={'/simu/' + pipe(pluck('name'), map(encodeRuleName), join('+'))(targets)}
	>
		<i className="fa fa-arrow-circle-left" aria-hidden="true" />Reprendre la
		simulation
	</Link>
)

let DisambiguateRuleQuery = ({ rules }) => (
	<div className="centeredMessage">
		<p>
			Plusieurs règles de la base ont ce nom. Laquelle voulez-vous afficher ?
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
