import 'core-js/fn/promise'

import React from 'react'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers/reducers'
import { changeThemeColour } from './actions'
import Layout from './containers/Layout'
import { SliderPicker } from 'react-color'
import { rules, rulesFr } from 'Engine/rules'
import lang from './i18n'

let store = createStore(reducers(rulesFr))

@connect(
	state => ({ couleur: state.themeColours.colour }),
	dispatch => ({
		changeColour: colour => dispatch(changeThemeColour(colour))
	})
)
class MyComponent extends React.Component {
	changeColour = ({ hex }) => this.props.changeColour(hex)
	render() {
		return (
			<div>
				<p className="indication">
					Visualisez sur cette page l'apparence du module pour différentes
					couleurs principales.
				</p>
				<SliderPicker
					color={this.props.couleur}
					onChangeComplete={this.changeColour}
				/>
				<p className="indication">
					La couleur sélectionnée, à déclarer comme attribut "data-couleur" du
					script sur votre page est : <b>{this.props.couleur}</b>
				</p>
				<Layout />
			</div>
		)
	}
}
render(
	<Provider store={store}>
		<MyComponent />
	</Provider>,
	document.querySelector('#coulorChooser')
)
