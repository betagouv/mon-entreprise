import React, { Component } from 'react'
import {connect} from 'react-redux'
import {usedVariables} from '../selectors/usedVariables'

let mapStateToProps = state => (
	{
		usedVariables: usedVariables(state)
	}
)


@connect(mapStateToProps)
export default class Analyse extends Component {
	render() {
		let {usedVariables} = this.props
		console.log('usedVariables', usedVariables)
		return (<div>Analyse</div>)
	}
}
