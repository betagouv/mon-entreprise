import R from 'ramda'
import React, {Component} from 'react'
import Helmet from 'react-helmet'
import {reduxForm, formValueSelector, reset} from 'redux-form'
import {connect} from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom'
import classNames from 'classnames'

import {START_CONVERSATION} from '../actions'
import Aide from './Aide'
import {createMarkdownDiv} from 'Engine/marked'
import {rules, findRuleByName, decodeRuleName} from 'Engine/rules'
import './conversation/conversation.css'
import './Simulateur.css'
import {capitalise0} from '../utils'
import Satisfaction from './Satisfaction'
import Results from './Results'

let situationSelector = formValueSelector('conversation')

@withRouter
@reduxForm({form: 'conversation', destroyOnUnmount: false})
@connect(
	state => ({
		situation: variableName => situationSelector(state, variableName),
		foldedSteps: state.foldedSteps,
		unfoldedSteps: state.unfoldedSteps,
		themeColours: state.themeColours,
		analysedSituation: state.analysedSituation,
	}),
	dispatch => ({
		startConversation: rootVariable => dispatch({type: START_CONVERSATION, rootVariable}),
		resetForm: () => dispatch(reset('conversation'))
	})
)
export default class extends React.Component {
	componentWillMount() {
		let {
			match: {
				params: {
					name: encodedName
				}
			}
		} = this.props,
			name = decodeRuleName(encodedName),
			existingConversation = this.props.foldedSteps.length > 0

		this.encodedName = encodedName
		this.name = name
		this.rule = findRuleByName(rules, name)

		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		if (!existingConversation)
			this.props.startConversation(name)
	}
	render(){
		if (!this.rule.formule) return <Redirect to={"/regle/" + this.name}/>

		let
			started = !this.props.match.params.intro,
			{foldedSteps, unfoldedSteps, situation} = this.props,
			sim = path =>
				R.path(R.unless(R.is(Array), R.of)(path))(this.rule.simulateur || {}),
			reinitalise = () => {
				this.props.resetForm(this.name)
				this.props.startConversation(this.name)
			},
			title = sim('titre') || capitalise0(this.rule['titre'] || this.rule['nom'])


		return (
			<div id="sim" className={classNames({started})}>
				<Helmet>
					<title>{title}</title>
					{sim('sous-titre') &&
						<meta name="description" content={sim('sous-titre')} />}
				</Helmet>
				<h1>{title}</h1>
				{sim('sous-titre') &&
					<div id="simSubtitle">{sim('sous-titre')}</div>
				}
				{sim(['introduction', 'notes']) &&
					<div className="intro centered">
						{sim(['introduction', 'notes']).map( ({icône, texte, titre}) =>
							<div key={titre}>
								<i title={titre} className={"fa "+icône} aria-hidden="true"></i>
								<span>
									{texte}
								</span>
							</div>
						)}
					</div>
				}
				{
					// Tant que le bouton 'C'est parti' n'est pas cliqué, on affiche l'intro
					!started ?
					<div>
						<div className="action centered">
							{createMarkdownDiv(sim(['introduction', 'motivation'])) || <p>Simulez cette règle en quelques clics</p>}
							<button onClick={() => this.props.history.push(`/simu/${this.encodedName}`)	}>
								C'est parti !
							</button>
						</div>
						<div className="remarks centered">
							<p>
								N'hésitez pas à nous écrire <Link to="/contact">
								<i className="fa fa-envelope-open-o" aria-hidden="true" style={{margin: '0 .3em'}}></i>
							</Link> ! La loi française est très ciblée, et donc complexe. Nous pouvons la rendre plus transparente.
							</p>
						</div>
					</div>
					: (
						<div id="playground">
							<div id="conversation">
								<div id="questions-answers">
									{ !R.isEmpty(foldedSteps) &&
										<div id="foldedSteps">
											<div className="header" >
												<h3>Vos réponses</h3>
												<button onClick={reinitalise}>
													<i className="fa fa-trash" aria-hidden="true"></i>
													Tout effacer
												</button>
											</div>
											{foldedSteps
												.map(step => (
													<step.component
														key={step.name}
														{...step}
														step={step}
														answer={situation(step.name)}
													/>
												))}
										</div>
									}
									<div id="unfoldedSteps">
										{ !R.isEmpty(unfoldedSteps) && do {
											let step = R.head(unfoldedSteps)
											;<step.component
												key={step.name}
												step={R.dissoc('component', step)}
												unfolded={true}
												answer={situation(step.name)}
											/>
										}}
									</div>
									{unfoldedSteps.length == 0 &&
										<Conclusion simu={this.name}/>}
									</div>
								<Aide />
							</div>
							<Results />
						</div>
					)}

			</div>
		)
	}
}

class Conclusion extends Component {
	render() {
		return (
			<div id="fin">
				<img src={require('../images/fin.png')} />
				<div id="fin-text">
					<p>
						Votre simulation est terminée !
					</p>
					<p>
						N'hésitez pas à modifier vos réponses, ou cliquez sur vos résultats pour comprendre le calcul.
					</p>
					<Satisfaction simu={this.props.simu}/>
				</div>
			</div>
		)
	}
}
