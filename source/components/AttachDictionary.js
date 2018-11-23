import marked from 'Engine/marked'
import { path } from 'ramda'
import React, { Component } from 'react'
import './Dictionary.css'
import Overlay from './Overlay'

// On ajoute à la section la possibilité d'ouvrir un panneau d'explication des termes.
// Il suffit à la section d'appeler une fonction fournie en lui donnant du JSX
export let AttachDictionary = dictionary => Decorated =>
	class withDictionary extends Component {
		state = {
			term: null,
			explanation: null
		}
		onClick = e => {
			let term = e.target.dataset['termDefinition'],
				explanation = path([term, 'description'], dictionary)
			if (!term) return null
			this.setState({ explanation, term })
		}
		renderExplanationMarkdown(explanation, term) {
			return marked(`### Mécanisme : ${term}\n\n${explanation}`)
		}
		render() {
			let { explanation, term } = this.state
			return (
				<div onClick={this.onClick}>
					<Decorated {...this.props} />
					{explanation && (
						<Overlay
							onClose={() => this.setState({ term: null, explanation: null })}>
							<div
								id="dictionaryPanel"
								dangerouslySetInnerHTML={{
									__html: this.renderExplanationMarkdown(explanation, term)
								}}
							/>
						</Overlay>
					)}
				</div>
			)
		}
	}
