import { React, Component } from 'Components'
import { connect } from 'react-redux'

export default connect(
	null,
	dispatch => ({ setRules: rules => dispatch({ type: 'SET_RULES', rules }) })
)(
	class extends Component {
		constructor(props) {
			super(props)
			fetch('https://publicodes.netlify.com/.netlify/functions/getRulesFile')
				.then(response => response.json())
				.then(json => {
					this.props.setRules(json)
				})
		}
		render() {
			return this.props.children
		}
	}
)
