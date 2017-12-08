import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rule from 'Components/rule/Rule'
import { analyse } from 'Engine/traverse'
import { head, path } from 'ramda'
import { decodeRuleName, nameLeaf, findRuleByName } from 'Engine/rules.js'
import {encodeRuleName} from 'Engine/rules'
import {pipe, pluck, join, map} from 'ramda'
import { Link, Redirect} from 'react-router-dom'
import {animateScroll} from 'react-scroll'
import './PageRule.css'

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
	componentDidMount(){
		animateScroll.scrollToTop({duration: 300})
	}
	componentWillReceiveProps(nextProps) {
		if (this.nameFromParams(nextProps) !== this.nameFromParams(this.props)) {
			this.setRule(this.nameFromParams(nextProps))
		}
	}
	setRule(name) {
		let ruleName = nameLeaf(decodeRuleName(name)),
			rule = findRuleByName(this.props.parsedRules, ruleName)
		if (!rule) return null
		this.rule = head(
			analyse(this.props.parsedRules, rule.name)(this.props.situationGate)
				.targets
		)
	}
	render() {
		if (!this.rule) return <Redirect to="/404" />

		let targets = path(['analysis', 'targets'], this.props)

		return (<>
			{targets && <BackToSimulation targets={targets}/> }
			<Rule rule={this.rule} />
		</>)
	}
}

let BackToSimulation = ({targets}) =>
	<Link id="toSimulation" to={'/simu/' + pipe(pluck('name'), map(encodeRuleName), join('+'))(targets)}>
		<i className="fa fa-arrow-circle-left" aria-hidden="true"></i>Reprendre la simulation
	</Link>
