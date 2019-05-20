/* @flow */
import { startConversation } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import PeriodSwitch from 'Components/PeriodSwitch'
import Simulation from 'Components/Simulation'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { compose, map, tryCatch } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { règleAvecMontantSelector } from 'Selectors/regleSelectors'
import Animate from 'Ui/animate'
import AnimatedTargetValue from 'Ui/AnimatedTargetValue'
import './SchemeComparaison.css'

import type { RègleAvecMontant } from 'Types/RegleTypes'

type OwnProps = {}

type Props = OwnProps & {
	assimiléSalarié: ?SimulationResult,
	indépendant: ?SimulationResult,
	autoEntrepreneur: ?SimulationResult,
	conversationStarted: boolean,
	noUserInput: boolean,
	startConversation: () => void,
	setSituationBranch: () => void
}

type SimulationResult = {
	retraite: RègleAvecMontant,
	revenuNet: RègleAvecMontant
}

const SchemeComparaisonPage = ({
	assimiléSalarié,
	indépendant,
	autoEntrepreneur,
	conversationStarted,
	setSituationBranch,
	startConversation
}: Props) => {
	const [showMore, setShowMore] = useState(false)
	return (
		<>
			<Helmet>
				<title>
					Assimilé salarié, indépendant, auto-entrepreneur : comparaison des
					régimes
				</title>
				<meta
					name="description"
					content="A partir d'un chiffre d'affaire donné, comparez le revenus net obtenu
				après paiement des cotisations sociale et impôts pour les différents
				régimes."
				/>
			</Helmet>
			<h1>Quel régime choisir pour l'indépendant ?</h1>
			<p>
				Lorsque vous créez votre société, vous devez choisir le régime social du
				dirigeant. Il en existe trois différents, avec chacun ses avantages et
				inconvénients.
			</p>
			<div className="ui__ full-width">
				<div className="comparaison-grid">
					<h2 className="AS">
						{emoji('☂')}{' '}
						<span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
							Assimilé salarié
						</span>
						<small>Le régime tout compris</small>
					</h2>
					<h2 className="indep">
						{emoji('👩‍🔧')}{' '}
						<span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
							Indépendant
						</span>
						<small>La protection à la carte</small>
					</h2>
					<h2 className="auto">
						{emoji('🚶‍♂️')}{' '}
						<span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
							Auto-entrepreneur
						</span>
						<small>Pour les petites activités</small>
					</h2>

					<h3 className="legend">Sécurité sociale</h3>
					<div className="AS">Régime général</div>
					<div className="indep-et-auto">
						Sécurité sociale des indépendants (SSI)
					</div>

					<h3 className="legend">Accidents du travail couverts</h3>
					<div className="AS">Oui</div>
					<div className="indep-et-auto">Non</div>

					<h3 className="legend">Assurance maladie</h3>
					<div className="green AS">++</div>
					<div className="green indep-et-auto">+</div>

					<h3 className="legend">Indémnités journalières</h3>
					<div className="green AS">++</div>
					<div className="indep-et-auto green">+</div>

					<h3 className="legend">Plafond de chiffre d'affaire</h3>
					<div className="AS-et-indep">Non</div>
					<div className="auto">Oui</div>

					{!conversationStarted && (
						<>
							<h3 className="legend">Retraite</h3>
							<div className="green AS">++</div>
							<div className="green indep">+</div>
							<div className="red auto">−</div>
						</>
					)}

					{conversationStarted && (
						<>
							<h3 className="legend">Période</h3>
							<div className="AS-indep-et-auto">
								<PeriodSwitch />
							</div>
						</>
					)}
					<div className="all">
						{!conversationStarted ? (
							<>
								<h2>Comparez vos revenus et votre retraite en 1 minute</h2>
								<button
									className="ui__ cta plain button"
									onClick={() => startConversation()}>
									Commencer
								</button>
							</>
						) : (
							<div className="ui__ container">
								<Simulation />
							</div>
						)}
					</div>

					{conversationStarted && (
						<>
							<h3 className="legend">Revenu net</h3>
							<div className="AS big">
								{assimiléSalarié && (
									<Animate.appear className="ui__ plain card">
										<AnimatedTargetValue
											value={assimiléSalarié.revenuNet.montant}
										/>
									</Animate.appear>
								)}
							</div>
							<div className="indep big">
								{indépendant && (
									<Animate.appear className="ui__ plain card">
										<AnimatedTargetValue
											value={indépendant.revenuNet.montant}
										/>
									</Animate.appear>
								)}
							</div>
							<div className="auto big">
								{autoEntrepreneur && (
									<Animate.appear className="ui__ plain card">
										<Link to={autoEntrepreneur.revenuNet.lien}>
											<AnimatedTargetValue
												value={autoEntrepreneur.revenuNet.montant}
											/>
										</Link>
									</Animate.appear>
								)}
							</div>

							<h3 className="legend">Retraite (estimation)</h3>
							<div className="AS big">
								{assimiléSalarié && (
									<a>
										<AnimatedTargetValue
											value={assimiléSalarié.retraite.montant}
										/>
									</a>
								)}
							</div>
							<div className="indep big">
								{indépendant && (
									<a>
										<AnimatedTargetValue value={indépendant.retraite.montant} />
									</a>
								)}
							</div>
							<div className="auto big">
								<a>
									{autoEntrepreneur && (
										<AnimatedTargetValue
											value={autoEntrepreneur.retraite.montant}
										/>
									)}
								</a>
							</div>
						</>
					)}

					{showMore ? (
						<>
							<h3 className="legend">ACCRE</h3>
							<div className="AS-et-indep">Une année, plafonné</div>
							<div className="auto">3 années, progressif, non plafonné</div>

							<h3 className="legend">Déduction des charges</h3>
							<div className="AS-et-indep">Régime réel </div>
							<div className="auto">Abattement forfaitaire </div>

							<h3 className="legend">Paiment des cotisations</h3>
							<div className="AS">Mensuel (à la source)</div>
							<div className="indep">Annuel avec deux ans de décalage</div>
							<div className="auto">Mensuel ou trimestriel</div>

							<h3 className="legend">
								Complémentaires retraite et santé déductibles
							</h3>
							<div className="AS">Oui (jusqu'à 50%)</div>
							<div className="indep">Oui (Loi Madelin)</div>
							<div className="auto">Non</div>

							<h3 className="legend">Cotisations minimales</h3>
							<div className="AS">Non</div>
							<div className="indep">Oui</div>
							<div className="auto">Non</div>

							<h3 className="legend">Seuil d'activation des droits</h3>
							<div className="AS">Oui</div>
							<div className="indep">Non</div>
							<div className="auto">Oui</div>
						</>
					) : (
						<>
							<h3 className="legend">Comparaison détaillée</h3>
							<div className="AS-indep-et-auto">
								<button
									onClick={() => setShowMore(true)}
									className="ui__ simple button">
									Afficher la comparaison détaillée
								</button>
							</div>
						</>
					)}
					<h3 className="legend">Comptabilité</h3>
					<div className="AS">Expert</div>
					<div className="indep">Compliquée</div>
					<div className="auto">Simplifiée</div>

					<h3 className="legend">Statuts juridiques possibles</h3>
					<div className="AS">SAS, SASU, SARL minoritaire</div>
					<div className="indep">EI, EURL, SARL majoritaire</div>
					<div className="auto">Micro-entreprise</div>
					<button
						className="AS ui__ button"
						onClick={() => {
							defineDirectorStatus('SALARIED')
							isAutoentrepreneur(false)
						}}>
						Choisir
					</button>
					<button
						className="indep ui__ button"
						onClick={() => {
							defineDirectorStatus('SELF_EMPLOYED')
							isAutoentrepreneur(false)
						}}>
						Choisir
					</button>
					<button
						className="auto ui__ button"
						onClick={() => {
							defineDirectorStatus('SELF_EMPLOYED')
							isAutoentrepreneur(true)
						}}>
						Choisir
					</button>
				</div>
			</div>
		</>
	)
}

export default (compose(
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			...map(
				situationBranchName =>
					tryCatch(
						() => ({
							retraite: règleAvecMontantSelector(state, {
								situationBranchName
							})('protection sociale . retraite'),
							revenuNet: règleAvecMontantSelector(state, {
								situationBranchName
							})('revenu net')
						}),
						() => null
					)(),
				{
					assimiléSalarié: 'Assimilé salarié',
					indépendant: 'Indépendant',
					autoEntrepreneur: 'Auto-entrepreneur'
				}
			)
		}),
		{ startConversation, defineDirectorStatus, isAutoentrepreneur }
	),
	withSimulationConfig(ComparaisonConfig)
)(SchemeComparaisonPage): React$Component<OwnProps>)
