import React, {Component} from 'react'
import HoverDecorator from 'Components/HoverDecorator'
import 'whatwg-fetch'
import {connect} from 'react-redux'

@connect(
	state => ({
		sessionId: state.sessionId
	})
)
export default class Satisfaction extends Component {
	state = {
		answer: false
	}
	sendSatisfaction(satisfait) {
		fetch('https://embauche.beta.gouv.fr/retour-syso', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				fields: {
					satisfait,
					message: '', //pas de message pour l'instant
					date: new Date().toISOString(),
					id: this.props.sessionId,
					url: document.location.href.toString()
				}
			})
		}).then(response => {
			if (!response.ok)
				return console.log('Erreur dans la récolte de la satisfaction') //eslint-disable-line no-console
			this.setState({answer: satisfait})

		})
	}
	render() {
		let {answer} = this.state
		if (answer)
			return (
				<p>
					{answer === ':)' ? 'Une suggestion' : 'Un problème'} ? Envie de discuter ? <br/>
					<a href={"mailto:contact@embauche.beta.gouv.fr?subject=Suggestion pour le simulateur " + this.props.simu}>
						Écrivez-nous <i className="fa fa-envelope-open-o" aria-hidden="true" style={{margin: '0 .3em'}}></i>
					</a>
				</p>
			)

		return (
			<p id="satisfaction">
				Vous êtes satisfait du simulateur ?
				{" "}
				<Smiley text=":)" hoverColor="#16a085" clicked={s => this.sendSatisfaction(s)}/>
				<Smiley text=":|" hoverColor="#f39c12" clicked={s => this.sendSatisfaction(s)}/>
			</p>
		)
	}
}

@HoverDecorator
export class Smiley extends Component {
	render() {
		return (
			<button
				onClick={() => this.props.clicked(this.props.text)}
				className="satisfaction-smiley"
				style={
					this.props.hover
						? {
							background: this.props.hoverColor,
							color: "white",
							borderColor: "transparent"
						}
						: {}
				}
			>
				{this.props.text}
			</button>
		)
	}
}
