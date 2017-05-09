import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {decodeRuleName} from '../engine/rules.js'
import './Rule.css'
import JSONTree from 'react-json-tree'
import R from 'ramda'
import PageTypeIcon from './PageTypeIcon'
import {connect} from 'react-redux'
import mockSituation from '../engine/mockSituation.yaml'
import {START_CONVERSATION} from '../actions'
import classNames from 'classnames'
import possiblesDestinataires from '../../règles/ressources/destinataires/destinataires.yaml'
import {capitalise0} from '../utils'
import knownMecanisms from '../engine/known-mecanisms.yaml'
import marked from '../engine/marked'
import References from './References'
import {AttachDictionary} from './AttachDictionary'
import {analyseSituation} from '../engine/traverse'
import {formValueSelector} from 'redux-form'


// situationGate function useful for testing :
let testingSituationGate = v => // eslint-disable-line no-unused-vars
	R.path(v.split('.'))(mockSituation)

@connect(
	state => ({
		situationGate: name => formValueSelector('conversation')(state, name),
		form: state.form
	}),
	dispatch => ({
		startConversation: rootVariable => dispatch({type: START_CONVERSATION, rootVariable}),
	})
)
export default class Rule extends Component {
	render() {
		let {
			match: {params: {name: encodedName}},
			situationGate,
			form
		} = this.props,
		name = decodeRuleName(encodedName)

		let rule = analyseSituation(name)(situationGate)
		console.log('rule', rule)
		// if (!rule) {
		// 	this.props.router.push('/404')
		// 	return null
		// }

		let
			situationExists = !R.isEmpty(form)

		let destinataire = R.path([rule.type, 'destinataire'])(rule),
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
											<img src={require('../../règles/ressources/destinataires/' + destinataireData.image)} /> }
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
