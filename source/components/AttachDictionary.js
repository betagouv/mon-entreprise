import R from 'ramda'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import marked from 'Engine/marked'
import './Dictionary.css'

// On ajoute à la section la possibilité d'ouvrir un panneau d'explication des termes.
// Il suffit à la section d'appeler une fonction fournie en lui donnant du JSX
export let AttachDictionary = dictionary => Decorated =>
	class extends React.Component {
		state = {
			term: null,
			explanation: null
		}
		componentDidMount() {
			let decoratedNode = ReactDOM.findDOMNode(this.decorated)
			decoratedNode.addEventListener('click', e => {
				let term = e.target.dataset['termDefinition'],
					explanation = R.path([term, 'description'], dictionary)
				this.setState({explanation, term})
			})
		}
		renderExplanationMarkdown(explanation, term) {
			return marked(`### Mécanisme: ${term}\n\n${explanation}`)
		}
		render(){
			let {explanation, term} = this.state
			return (
				<div style={{display: 'inline-block'}} className="dictionaryWrapper">
					<Decorated ref={decorated => this.decorated = decorated} {...this.props} explain={this.explain}/>
					{explanation &&
						<div id="dictionaryPanelWrapper" onClick={() => this.setState({term: null, explanation: null})}>
							<div id="dictionaryPanel"
								onClick={e => {e.preventDefault(); e.stopPropagation()}}
								dangerouslySetInnerHTML={{__html: this.renderExplanationMarkdown(explanation, term)}}>
							</div>
						</div>
					}
				</div>
			)
		}
	}
