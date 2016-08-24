import React, { Component } from 'react'
import {connect} from 'react-redux'
import {usedVariables} from '../selectors/usedVariables'
import './Analyse.css'

let mapStateToProps = state => (
	{
		usedVariables: usedVariables(state)
	}
)


@connect(mapStateToProps)
export default class Analyse extends Component {
	state = {variableStats: null}
	render() {
		let {variableStats} = this.state
		return (
			<div>
				{variableStats ?
					<ul id="top-input-variables">
						{variableStats.map(([name, count]) =>
							<li key={name}>{name} {count}</li>
						)}
					</ul>
				: <div>En attente...</div>}
			</div>
		)
	}
	componentDidMount(){
		this.props.usedVariables.then(
			variables => this.setState({variableStats: variables})
		)
	}
}
