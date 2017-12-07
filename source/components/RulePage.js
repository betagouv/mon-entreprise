import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rule from 'Components/rule/Rule'
import { analyse } from 'Engine/traverse'
import { head, path } from 'ramda'
import { decodeRuleName, nameLeaf, findRuleByName } from 'Engine/rules.js'

@connect(state => ({
	situationGate: state.situationGate,
	parsedRules: state.parsedRules
}))
export default class RulePage extends Component {
	nameFromParams = path(['match', 'params', 'name'])
	componentWillMount() {
		this.setRule(this.nameFromParams(this.props))
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
	// Est-ce nécessaire ? Pour naviguer dans les Rules ?
	// componentWillReceiveProps(nextProps) {
	// 	let get = R.path(['match', 'params', 'name'])
	// 	if (get(nextProps) !== get(this.props)) {
	// 		this.setRule(get(nextProps))
	// 		this.setState({ example: null, showValues: true })
	// 	}
	// }
	render() {
		if (!this.rule) return <Redirect to="/404" />

		return <Rule rule={this.rule} />
	}
}
