import React from 'react'
import { SliderPicker } from 'react-color'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import Layout from './containers/Layout'
import reducers from './reducers/reducers'

let store = createStore(reducers)

@connect(
	state => ({ couleur: state.themeColours.colour }),
	dispatch => ({
		changeColour: colour => dispatch({ type: 'CHANGE_THEME_COLOUR', colour })
	})
)
class MyComponent extends React.Component {
	changeColour = ({ hex }) => this.props.changeColour(hex)
	render() {
		return (
			<div>
				<p className="indication">
					Visualisez sur cette page l’apparence du module pour différentes
					couleurs principales.
				</p>
				<SliderPicker
					color={this.props.couleur}
					onChangeComplete={this.changeColour}
				/>
				<p className="indication">
					La couleur sélectionnée, à déclarer comme attribut
					&quot;data-couleur&quot; du script sur votre page est :{' '}
					<b>{this.props.couleur}</b>
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
