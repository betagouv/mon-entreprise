import React, { Component } from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { render } from 'react-dom'
import yaml from 'js-yaml'
import rawRulesText from '!raw-loader!Règles/base.yaml'
import rawRules from 'Règles/base.yaml'

export default class Source extends Component {
	render() {
		return (
			<div id="Source" className="ui__ container">
				<h1>La sourceee</h1>
				<div style={{ whiteSpace: 'pre-line' }}>{yaml.safeDump(rawRules)}</div>
			</div>
		)
	}
}
