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

			let devMode = process.env.NODE_ENV === 'development'
			if (devMode) {
				import('../../futureco-data/co2.yaml').then(src =>
					this.props.setRules(src.default)
				)
			} else {
				fetch(
					'https://publicodes.netlify.com/.netlify/functions/getRulesFile?' +
						toPairs(props.rulesConfig.fetch)
							.map(([k, v]) => k + '=' + v)
							.join('&'),
					{ mode: 'cors' }
				)
					.then(response => response.json())
					.then(json => {
						this.props.setRules(json)
					})
			}
		}
		render() {
			let customLoader = this.props.rulesConfig.loaderComponent
			if (!this.props.rulesLoaded)
				return customLoader ? (
					customLoader
				) : (
					<div>La loi est en cours de chargement ...</div>
				)
			return this.props.children
		}
	}
)
