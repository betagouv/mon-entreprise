import React, { Component } from 'react'
import HoverDecorator from './HoverDecorator'
import 'whatwg-fetch'
import { connect } from 'react-redux'
import './Satisfaction.css'
import classNames from 'classnames'

import ReactPiwik from './Tracker'

@connect(state => ({
	sessionId: state.sessionId
}))
export default class Satisfaction extends Component {
	state = {
		answer: false,
		message: null,
		address: null,
		messageSent: false
	}
	sendSatisfaction(answer) {
		let { message, address } = this.state
		if (document.location.hostname != 'localhost') {
			fetch('https://embauche.beta.gouv.fr/retour-syso', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fields: {
						satisfait: answer || '',
						message:
							(message || '') + (address ? '(envoyé par ' + address + ')' : ''),
						date: new Date().toISOString(),
						id: this.props.sessionId,
						url: document.location.href.toString()
					}
				})
			}).then(response => {
				console.log(response)
				if (!response.ok)
					return console.log('Erreur dans la récolte de la satisfaction') //eslint-disable-line no-console
				if (message) return this.setState({ messageSent: true })
				this.setState({ answer })
			})
		} else {
			console.log('!!!!!!!! Les retours ne sont pas envoyés en localhost !')
			if (message) this.setState({ messageSent: true })
			this.setState({ answer })
		}
	}
	render() {
		let { answer, message, address, messageSent } = this.state,
			validMessage =
				(typeof message == 'string' && message.length > 4) ||
				(typeof address == 'string' && address.length > 4),
			onSmileyClick = s => {
				// Pour l'instant on double le flux avec Piwik
				ReactPiwik.push(['trackEvent', 'feedback', 'smiley', s])
				this.sendSatisfaction(s)
			}

		if (!answer)
			return (
				<div id="satisfaction">
					<p>Vous êtes satisfait du simulateur ?</p>
					<p>
						<Smiley text=":)" hoverColor="#16a085" clicked={onSmileyClick} />
						<Smiley text=":|" hoverColor="#f39c12" clicked={onSmileyClick} />
					</p>
				</div>
			)

		let messagePlaceholder = {
			':)': 'Envoyez-nous un commentaire !',
			':|': 'Qu\'est-ce qui n\'a pas été ?'
		}[answer]

		let feedback = (
			<div>
				<input
					type="text"
					value={this.state.address || ''}
					onChange={e => this.setState({ address: e.target.value })}
					placeholder="adresse@courriel.com (optionnel)"
				/>
				<textarea
					value={this.state.message || ''}
					onChange={e => this.setState({ message: e.target.value })}
					placeholder={messagePlaceholder}
				/>
			</div>
		)

		return (
			<div id="satisfaction">
				{!messageSent && feedback}
				<button
					id="sendMessage"
					disabled={!validMessage || messageSent}
					onClick={() => this.sendSatisfaction()}
				>
					{messageSent ? (
						<i id="messageSent" className="fa fa-check" aria-hidden="true" />
					) : (
						<span>
							<i className="fa fa-paper-plane" aria-hidden="true" />
							<span className="text">envoyer</span>
						</span>
					)}
				</button>
				<p>
					Pour recevoir une réponse, laissez-nous votre adresse ou{' '}
					<a
						href={
							'mailto:contact@embauche.beta.gouv.fr?subject=Suggestion pour le simulateur ' +
							this.props.simu
						}
					>
						envoyez-nous directement un mail{' '}
						<i
							className="fa fa-envelope-open-o"
							aria-hidden="true"
							style={{ margin: '0 .3em' }}
						/>
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
							color: 'white',
							borderColor: 'transparent'
						}
						: {}
				}
			>
				{this.props.text}
			</button>
		)
	}
}
