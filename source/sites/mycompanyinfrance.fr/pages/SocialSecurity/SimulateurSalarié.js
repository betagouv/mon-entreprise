import React from 'react'
import Simulateur from 'Components/Simu'

import { connect } from 'react-redux'
import { change } from 'redux-form'

export default connect(
	null,
	dispatch => ({
		setAssimilé: value =>
			dispatch(
				change('conversation', 'contrat salarié . assimilé salarié', value)
			)
	})
)(
	class extends React.Component {
		constructor(props) {
			super(props)
			this.props.setAssimilé('non')
		}
		render() {
			return (
				<div style={{ marginTop: '2em' }}>
					<p>
						Dès que l'embauche d'un salarié est déclarée et qu'il est payé, il
						est couvert par le régime général de la Sécurité sociale (santé,
						maternité, invalidité, vieillesse, maladie professionnelle et
						accidents) et chômage.
					</p>
					<Simulateur displayHiringProcedures />
				</div>
			)
		}
	}
)
