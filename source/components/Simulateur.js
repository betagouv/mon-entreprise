import React, {Component} from 'react'
import './CDD.css'
import {reduxForm, formValueSelector, reset} from 'redux-form'
import {connect} from 'react-redux'
import './conversation/conversation.css'
import {START_CONVERSATION} from '../actions'
import Aide from './Aide'
import PageTypeIcon from './PageTypeIcon'
import simulateurs from '../../règles/simulateurs.yaml'
import R from 'ramda'
import {Redirect, Link, withRouter} from 'react-router-dom'
import {createMarkdownDiv} from '../engine/marked'
import './Simulateur.css'
import classNames from 'classnames'
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
					simulateurId
				}
			}
		} = this.props

		this.simulateurId = simulateurId
		this.simulateur = R.find(R.propEq('id', simulateurId))(simulateurs)

		// C'est ici que la génération du formulaire, et donc la traversée des variables commence
		if (this.simulateur)
			this.props.startConversation(this.simulateur.objectif)
	}
	render(){
		if (!this.simulateur) return <Redirect to="/404"/>

		let
			started = !this.props.match.params.intro,
			{foldedSteps, unfoldedSteps, situation} = this.props,
			sim = path =>
				R.path(R.unless(R.is(Array), R.of)(path))(this.simulateur),
			objectif = this.simulateur.objectif,
			reinitalise = () => {
				this.props.resetForm(objectif);
				this.props.startConversation(objectif);
			}


		return (
			<div id="sim" className={classNames({started})}>
				<PageTypeIcon type="simulation" />
				<h1>{sim('titre')}</h1>
				<div id="simSubtitle">{sim('sous-titre')}</div>
				<div className="intro centered">
					{sim('introduction').map( ({icône, texte, titre}) =>
						<div key={titre}>
							<i title={titre} className={"fa "+icône} aria-hidden="true"></i>
							<span>
								{texte}
							</span>
						</div>
					)}
				</div>
				{
					// Tant que le bouton 'C'est parti' n'est pas cliqué, on affiche l'intro
					!started ?
					<div>
						<div className="action centered">
							<p>{sim(['action', 'texte'])}</p>
							<button onClick={() => this.props.history.push(`/simu/${this.simulateurId}`)	}>
								{sim(['action', 'bouton'])}
							</button>
						</div>
						<div className="remarks centered">
							<p>
								Pour simplifier, les résultats sont calculés par mois de contrat.
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
										<div id="fin">
											<img src={require('../images/fin.png')} />
											{createMarkdownDiv(sim('conclusion'))}
										</div>}
									</div>
								<Aide />
							</div>
						</div>
					)}

			</div>
		)
	}
}
