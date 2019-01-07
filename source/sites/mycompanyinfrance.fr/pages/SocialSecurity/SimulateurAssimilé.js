import Simulateur from 'Components/Simu'
import React from 'react'
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
	class SimulateurAssimilé extends React.Component {
		constructor(props) {
			super(props)
			this.props.setAssimilé('oui')
		}
		render() {
			return (
				<div style={{ marginTop: '2em' }}>
					<p>
						Les gérants égalitaires ou minoritaires de SARL ou les dirigeants de
						SA et SAS sont <strong>assimilés&nbsp;salariés</strong> et relèvent
						du régime général. Les cotisations sociales sont proches de celles
						des salariés, à quelques exceptions près.
					</p>
					<Simulateur displayHiringProcedures />
				</div>
			)
		}
	}
)
