import React, {Component} from 'react'
import './CDD.css'
import {reduxForm, formValueSelector, reset} from 'redux-form'
import {connect} from 'react-redux'
import './conversation/conversation.css'
import {START_CONVERSATION} from '../actions'
import Aide from './Aide'
import PageTypeIcon from './PageTypeIcon'
import R from 'ramda'
import {Redirect, Link, withRouter} from 'react-router-dom'
import {createMarkdownDiv} from '../engine/marked'
import './Simulateur.css'
import classNames from 'classnames'
import {findRuleByName, decodeRuleName} from '../engine/rules'
import {capitalise0} from '../utils'

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
		resetForm: rootVariable => dispatch(reset('conversation'))
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
		name = decodeRuleName(encodedName)

		this.encodedName = encodedName
		this.name = name
		this.rule = findRuleByName(name)

		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		if (this.rule.formule)
			this.props.startConversation(name)
	}
	render(){
		if (!this.rule.formule) return <Redirect to="/404"/>

		let
			started = !this.props.match.params.intro,
			{foldedSteps, unfoldedSteps, situation} = this.props,
			sim = path =>
				R.path(R.unless(R.is(Array), R.of)(path))(this.rule.simulateur || {}),
			reinitalise = () => {
				this.props.resetForm(this.name);
				this.props.startConversation(this.name);
			}


		return (
			<div id="sim" className={classNames({started})}>
				<PageTypeIcon type="simulation" />
				<h1>{sim('titre') || capitalise0(this.rule['titre'] || this.rule['nom'])}</h1>
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
							<p>{sim(['introduction', 'motivation']) || 'Simulez cette règle en quelques clics'}</p>
							<button onClick={() => this.props.history.push(`/simu/${this.encodedName}`)	}>
								C'est parti !
							</button>
						</div>
						<div className="remarks centered">
							<p>
								Pour simplifier, les résultats sont calculés par mois de contrat, et pour un temps complet.
							</p>
							<p>
								N'hésitez pas à <Link to="/contact">nous écrire</Link> ! La loi française est très ciblée, et donc complexe. Nous pouvons la rendre plus transparente.
							</p>
						</div>
					</div>
					: (
						<div>
							<div id="conversation">
								<div id="questions-answers">
									{ !R.isEmpty(foldedSteps) &&
										<div id="foldedSteps">
											<div id="reinitialise" >
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
										<Conclusion />}
									</div>
								<Aide />
							</div>
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
				<p>
					Nous n'avons plus de questions : votre simulation est terminée.
				</p>
				<p>
					Cliquez sur les obligations en bas pour comprendre vos résultats.
				</p>
				<p>
					Une remarque ? <Link to="/contact">Écrivez-nous !</Link>
				</p>
			</div>
		)
	}
}
