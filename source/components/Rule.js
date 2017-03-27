import React, { Component } from 'react'
// import {findRuleByName} from '../engine/rules.js'
import './Rule.css'
import JSONTree from 'react-json-tree'
import R from 'ramda'
import PageTypeIcon from './PageTypeIcon'
import {connect} from 'react-redux'
import mockSituation from '../engine/mockSituation.yaml'
import {START_CONVERSATION} from '../actions'
import classNames from 'classnames'
import destinataires from '../../règles/destinataires/destinataires.yaml'
import references from '../../règles/références/références.yaml'

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
		startConversation: () => dispatch({type: START_CONVERSATION}),
	})
)
export default class Rule extends Component {
	state = {
		showValues: false
	}
	componentDidMount() {
		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		this.props.startConversation()
	}
	render() {
		let {
			params: {name},
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
			situationExists = !R.isEmpty(form),
			showValues = situationExists && this.state.showValues

		let destinataire = R.path(['attributs', 'destinataire'])(rule),
			destinataireData = destinataires[destinataire]


		return (
			<div id="rule">
				<PageTypeIcon type="comprendre"/>
				<h1>
					<span className="rule-type">{rule.type}</span>
					<span className="rule-name">{name}</span>
				</h1>
				<section id="rule-meta">
					<div id="meta-paragraph">
						<p>
							{rule.description}
						</p>
					</div>
					<div id="destinataire">
						<h2>Destinataire</h2>
						<a href={destinataireData.lien} target="_blank">
							{destinataireData.image &&
								<img src={require('../../règles/destinataires/' + destinataireData.image)} /> }
							{!destinataireData.image &&
								<div id="calligraphy">{destinataire}</div>
							}
						</a>
						{destinataireData.nom && <div id="destinataireName">{destinataireData.nom}</div>}
					</div>
					<div>
						<h2>Références</h2>
						{this.renderReferences(rule)}
					</div>
				</section>
				<section id="rule-rules" className={classNames({showValues})}>
					{ do {
						let [,cond] =
							R.toPairs(rule).find(([,v]) => v.rulePropType == 'cond') || []
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
					{situationExists &&
						<button id="showValues" onClick={() => this.setState({showValues: !this.state.showValues})}>
							<i className="fa fa-rocket" aria-hidden="true"></i> &nbsp;{!showValues ? 'Injecter votre situation' : 'Cacher votre situation'}
						</button>
					}
				</section>


				{/* <pre>
						<JSONView data={rule} />
				</pre> */}
			</div>
		)
	}

	renderReferences({'références': refs}) {
		if (!refs) return <p>Cette règle manque de références.</p>

		return (
			<ul id="references">
				{R.toPairs(refs).map(
					([name, link]) => {
						let refkey = Object.keys(references).find(r => link.indexOf(r) > -1),
							refData = refkey && references[refkey] || {},
							domain = (link.indexOf("://") > -1
								? link.split('/')[2]
								: link.split('/')[0]).replace('www.', '')

						return <li key={name}>
							<span className="meta">
								<span className="url">
									{domain}
									{refData.image &&
										<img src={require('../../règles/références/' + refData.image)}/> }
								</span>
							</span>
							<a href={link} target="_blank">
								{name}
							</a>
						</li>
				})}
			</ul>
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
