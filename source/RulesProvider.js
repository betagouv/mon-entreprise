import { React, Component } from 'Components'
import { connect } from 'react-redux'
import { toPairs } from 'ramda'

export default connect(
	state => ({ rulesLoaded: state.rules != null }),
	dispatch => ({ setRules: rules => dispatch({ type: 'SET_RULES', rules }) })
)(
	class extends Component {
		constructor(props) {
			super(props)
			fetch(
				'https://publicodes.netlify.com/.netlify/functions/getRulesFile?' +
					toPairs(props.rulesConfig)
						.map(([k, v]) => k + '=' + v)
						.join('&'),
				{ mode: 'cors' }
			)
				.then(response => response.json())
				.then(json => {
					this.props.setRules(json)
				})
		}
		render() {
			if (!this.props.rulesLoaded)
				return <div>La loi est en cours de chargement ...</div>
			return this.props.children
		}
	}
)
