import React, {Component} from 'react'

export default DecoratedComponent =>
	class extends Component {
		state = {
			hover: false,
		}
		toggleHover = () =>
			this.setState({hover: !this.state.hover})
		render() {
			return <span onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >
				<DecoratedComponent {...this.props} hover={this.state.hover}/>
			</span>
		}
	}
