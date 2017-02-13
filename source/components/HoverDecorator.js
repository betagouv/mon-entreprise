import React, {Component} from 'react'

export default DecoratedComponent =>
	class extends Component {
		state = {
			hover: false,
		}
		setHover = state => () =>
			this.setState({hover: state})
		render() {
			return <span onMouseEnter={this.setHover(true)} onMouseLeave={this.setHover(false)} >
				<DecoratedComponent {...this.props} hover={this.state.hover}/>
			</span>
		}
	}
