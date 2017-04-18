import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import {findRuleByName} from '../engine/rules.js'
import './Rule.css'
import JSONTree from 'react-json-tree'
import R from 'ramda'
import PageTypeIcon from './PageTypeIcon'
import {connect} from 'react-redux'
import mockSituation from '../engine/mockSituation.yaml'
import {START_CONVERSATION} from '../actions'
import classNames from 'classnames'
import possiblesDestinataires from '../../règles/destinataires/destinataires.yaml'
import {capitalise0} from '../utils'
import knownMecanisms from '../engine/known-mecanisms.yaml'
import marked from '../engine/marked'
import References from './References'

// situationGate function useful for testing :
let testingSituationGate = v => // eslint-disable-line no-unused-vars
	R.path(v.split('.'))(mockSituation)

@connect(
	state => ({
		// situationGate: name => formValueSelector('conversation')(state, name),
		analysedSituation: state.analysedSituation,
		form: state.form
	}),
	dispatch => ({
		startConversation: rootVariable => dispatch({type: START_CONVERSATION, rootVariable}),
	})
)
export default class Rule extends Component {
	componentDidMount() {
		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		this.props.startConversation('surcoût CDD')
	}
	render() {
		let {
			match: {params: {name}},
			analysedSituation,
			form
		} = this.props,
			objectives = R.path(['formule', 'explanation', 'explanation'])(analysedSituation)

		if (!objectives) return null

		let rule = objectives.find(R.pathEq(['explanation', 'name'], name)).explanation

		if (!rule) {
			this.props.router.push('/404')
			return null
		}

		let
			situationExists = !R.isEmpty(form)

		let destinataire = R.path(['attributs', 'destinataire'])(rule),
			destinataireData = possiblesDestinataires[destinataire]


		return (
			<div id="rule">
				<PageTypeIcon type="comprendre"/>
				<h1>
					<span className="rule-type">{rule.type}</span>
					<span className="rule-name">{capitalise0(name)}</span>
				</h1>
				<section id="rule-meta">
					<div id="meta-paragraph">
						<p>
							{rule.description}
						</p>
					</div>
					<div id="destinataire">
						<h2>Destinataire</h2>
						{!destinataireData ?
								<p>Non renseigné</p>
							: <div>
									<a href={destinataireData.lien} target="_blank">
										{destinataireData.image &&
											<img src={require('../../règles/destinataires/' + destinataireData.image)} /> }
										{!destinataireData.image &&
											<div id="calligraphy">{destinataire}</div>
										}
									</a>
									{destinataireData.nom && <div id="destinataireName">{destinataireData.nom}</div>}
								</div>
						}

					</div>
					<div>
						<h2>Références</h2>
						{this.renderReferences(rule)}
					</div>
				</section>
				<Algorithm {...{rule, situationExists}}/>
			</div>
		)
	}

	renderReferences({'références': refs}) {
		if (!refs) return <p>Cette règle manque de références.</p>

		return <References refs={refs}/>
	}
}

// On ajoute à la section la possibilité d'ouvrir à droite un panneau d'explication des termes.
// Il suffit à la section d'appeler une fonction fournie en lui donnant du JSX
// Ne pas oublier de réduire la largeur de la section pour laisser de la place au dictionnaire.
let AttachDictionary = dictionary => Decorated =>
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
				<div className="dictionaryWrapper">
					<Decorated ref={decorated => this.decorated = decorated} {...this.props} explain={this.explain}/>
					{explanation &&
						<div className="dictionaryPanelWrapper" onClick={() => this.setState({term: null, explanation: null})}>
							<div className="dictionaryPanel"
								onClick={e => {e.preventDefault(); e.stopPropagation()}}
								dangerouslySetInnerHTML={{__html: this.renderExplanationMarkdown(explanation, term)}}>
							</div>
						</div>

					}
				</div>
			)
		}
	}

@AttachDictionary(knownMecanisms)
class Algorithm extends React.Component {
	state = {
		showValues: false
	}
	render(){
		let {rule, situationExists, explain} = this.props,
			showValues = situationExists && this.state.showValues
		return (
			<div id="algorithm">
				<section id="rule-rules" className={classNames({showValues})}>
					{ do {
						// TODO ce let est incompréhensible !
						let [,cond] =
							R.toPairs(rule).find(([,v]) => v && v.rulePropType == 'cond') || []
						cond != null &&
							<section id="declenchement">
								<h2>Conditions de déclenchement</h2>
								{cond.jsx}
							</section>
					}}
					<section id="formule">
						<h2>Calcul</h2>
						{rule['formule'].jsx}
					</section>
				</section>
				{situationExists && <div>
					<button id="showValues" onClick={() => this.setState({showValues: !this.state.showValues})}>
						<i className="fa fa-rocket" aria-hidden="true"></i> &nbsp;{!showValues ? 'Injecter votre situation' : 'Cacher votre situation'}
					</button>
				</div>}
			</div>
		)
	}
}

let JSONView = ({o, rootKey}) => (
	<div className="json">
		<JSONTree
			getItemString={() => ''}
			theme={theme}
			hideRoot={true}
			shouldExpandNode={() => true}
			data={rootKey ? {[rootKey]: o} : o}
		/>
	</div>
)



var theme =  {
	scheme: 'atelier forest',
	author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
	base00: '#1b1918',
	base01: '#2c2421',
	base02: '#68615e',
	base03: '#766e6b',
	base04: '#9c9491',
	base05: '#a8a19f',
	base06: '#e6e2e0',
	base07: '#f1efee',
	base08: '#f22c40',
	base09: '#df5320',
	base0A: '#d5911a',
	base0B: '#5ab738',
	base0C: '#00ad9c',
	base0D: '#407ee7',
	base0E: '#6666ea',
	base0F: '#c33ff3'
}
