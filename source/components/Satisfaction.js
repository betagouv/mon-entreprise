import React, {Component} from 'react'
import HoverDecorator from './HoverDecorator'
import 'whatwg-fetch'
import {connect} from 'react-redux'
import './Satisfaction.css'
import classNames from 'classnames'

@connect(
	state => ({
		sessionId: state.sessionId
	})
)
export default class Satisfaction extends Component {
	state = {
		answer: false,
		message: null,
		messageSent: false
	}
	sendSatisfaction(answer) {
		let {message} = this.state
		fetch('https://embauche.beta.gouv.fr/retour-syso', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				fields: {
					satisfait: answer || '',
					message: message || '',
					date: new Date().toISOString(),
					id: this.props.sessionId,
					url: document.location.href.toString()
				}
			})
		}).then(response => {
			if (!response.ok)
				return console.log('Erreur dans la récolte de la satisfaction') //eslint-disable-line no-console
			if (message)
				return this.setState({messageSent: true})
			this.setState({answer})
		})
	}
	render() {
		let {answer, message, messageSent} = this.state,
			validMessage = typeof message == 'string' && message.length > 4,
			onSmileyClick = s => this.sendSatisfaction(s)

		if (!answer)
			return (
				<p id="satisfaction">
					Vous êtes satisfait du simulateur ?
					{" "}
					<Smiley text=":)" hoverColor="#16a085" clicked={onSmileyClick}/>
					<Smiley text=":|" hoverColor="#f39c12" clicked={onSmileyClick}/>
				</p>
			)

		let messagePlaceholder = {
			':)': 'Envoyez-nous un commentaire !',
			':|': "Qu'est-ce qui n'a pas été ?"
		}[answer]

		return (
			<div id="satisfaction">
				{!messageSent &&
					<textarea
						value={this.state.message || ''}
						onChange={e => this.setState({message: e.target.value})}
						placeholder={messagePlaceholder} /> }
				<button id="sendMessage" disabled={!validMessage || messageSent} onClick={() => this.sendSatisfaction()}>
					{messageSent ?
						<i id="messageSent" className="fa fa-check" aria-hidden="true"></i>
					: <span>
						<i className="fa fa-paper-plane" aria-hidden="true"></i>
						<span className="text">envoyer</span>
					</span>
					}
				</button>
				<p>
					Pour recevoir une réponse, donnez-nous votre adresse ou {' '}
					<a href={"mailto:contact@embauche.beta.gouv.fr?subject=Suggestion pour le simulateur " + this.props.simu}>
						envoyez-nous directement un mail <i className="fa fa-envelope-open-o" aria-hidden="true" style={{margin: '0 .3em'}}></i>
					</a>
				</p>
			</div>
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
