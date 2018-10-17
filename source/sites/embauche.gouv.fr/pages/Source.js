import React, { Component } from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { render } from 'react-dom'
import MonacoEditor from 'react-monaco-editor'
import yaml from 'js-yaml'
import rawRules from '!raw-loader!Règles/base.yaml'

@connect(state => ({
	flatRules: flatRulesSelector(state)
}))
export default class Source extends Component {
	state = {
		code: rawRules
	}
	render() {
		let { flatRules } = this.props
		return (
			<div id="Source" className="ui__ container">
				<h1>La source</h1>
				<MonacoEditor
					width="800"
					height="600"
					language="yaml"
					theme="vs-dark"
					value={this.state.code}
				/>
			</div>
		)
	}
}
