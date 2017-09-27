import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {formValueSelector} from 'redux-form'
import R from 'ramda'
import './Rule.css'
import {rules, decodeRuleName} from 'Engine/rules.js'
import mockSituation from 'Engine/mockSituation.yaml'
import {analyseSituation} from 'Engine/traverse'
import {START_CONVERSATION} from '../../actions'
import possiblesDestinataires from 'Règles/ressources/destinataires/destinataires.yaml'
import {capitalise0} from '../../utils'
import References from './References'
import Algorithm from './Algorithm'
import Examples from './Examples'
import Helmet from 'react-helmet'

@connect(
	state => ({
		situationGate: state.situationGate,
		form: state.form
	}),
	dispatch => ({
		startConversation: rootVariable => dispatch({type: START_CONVERSATION, rootVariable}),
	})
)
export default class Rule extends Component {
	state = {
		example: null, showValues: true
	}
	componentWillReceiveProps(nextProps){
		let get = R.path(['match', 'params', 'name'])
		if (get(nextProps) !== get(this.props)) {
			this.setRule(get(nextProps))
			this.setState({example: null, showValues: true})
		}
	}
	setRule(name){
		this.rule = analyseSituation(rules, decodeRuleName(name))(this.props.situationGate)
	}
	componentWillMount(){
		let {
			match: {params: {name}},
			situationGate
		} = this.props

		this.setRule(name)
	}
	render() {

		// if (!rule) {
		// 	this.props.router.push('/404')
		// 	return null
		// }

		let
			situationExists = !R.isEmpty(this.props.form)

		let
			{type, name, description} = this.rule,
			destinataire = R.path([type, 'destinataire'])(this.rule),
			destinataireData = possiblesDestinataires[destinataire]

		return (
			<div id="rule">
				<Helmet>
					<title>{capitalise0(name)}</title>
					<meta name="description" content={description} />
				</Helmet>
				<h1>
					<span className="rule-type">{type}</span>
					<span className="rule-name">{capitalise0(name)}</span>
				</h1>
				<section id="rule-meta">
					<div id="meta-paragraph">
						<p>
							{description}
						</p>
					</div>
					<div id="destinataire">
						<h2>Destinataire</h2>
						{!destinataireData ?
								<p>Non renseigné</p>
							: <div>
									<a href={destinataireData.lien} target="_blank">
										{destinataireData.image &&
											<img src={require('Règles/ressources/destinataires/' + destinataireData.image)} /> }
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
						{this.renderReferences(this.rule)}
					</div>
				</section>
				<section id="rule-calc">
					<Algorithm {...{traversedRule: R.path(['example', 'rule'])(this.state) || this.rule, showValues: situationExists || this.state.example != null}}/>
					<Examples
						situationExists={situationExists}
						rule={this.rule}
						focusedExample={this.state.example}
						showValues={this.state.showValues}
						inject={example => this.setState({example, showValues: true})}/>
				</section>
			</div>
		)
	}

	renderReferences({'références': refs}) {
		if (!refs) return <p>Cette règle manque de références.</p>

		return <References refs={refs}/>
	}
}
