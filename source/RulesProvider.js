import { React, Component } from 'Components'
import { connect } from 'react-redux'
import { toPairs } from 'ramda'

export default connect(
	state => ({ rulesLoaded: state.rules != null }),
	dispatch => ({ setRules: rules => dispatch({ type: 'SET_RULES', rules }) })
)(
	class extends Component {
		removeLoader() {
			// Remove loader
			var css = document.createElement('style')
			css.type = 'text/css'
			css.innerHTML = `
#js {
        animation: appear 0.5s;
        opacity: 1;
}
#loading {
        display: none !important;
}`
			document.body.appendChild(css)
		}
		constructor(props) {
			super(props)

			if (process.env.NODE_ENV === 'development') {
				import('../../futureco-data/co2.yaml').then(src => {
					this.props.setRules(src.default)
					this.removeLoader()
				})
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
						this.removeLoader()
					})
			}
		}
		render() {
			if (!this.props.rulesLoaded) return null
			return this.props.children
		}
	}
)
