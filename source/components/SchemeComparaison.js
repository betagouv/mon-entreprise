/* @flow */
import { startConversation } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import classnames from 'classnames'
import { T } from 'Components'
import PeriodSwitch from 'Components/PeriodSwitch'
import Simulation from 'Components/Simulation'
// $FlowFixMe
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { compose, map, tryCatch } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { branchAnalyseSelector } from 'Selectors/analyseSelectors'
import { règleAvecMontantSelector } from 'Selectors/regleSelectors'
import Animate from 'Ui/animate'
import AnimatedTargetValue from 'Ui/AnimatedTargetValue'
import './SchemeComparaison.css'

import type { RègleAvecMontant } from 'Types/RegleTypes'

type OwnProps = {
	hideAutoEntrepreneur?: boolean,
	hideAssimiléSalarié?: boolean
}

type Props = OwnProps & {
	assimiléSalarié: ?SimulationResult,
	indépendant: ?SimulationResult,
	autoEntrepreneur: ?SimulationResult,
	conversationStarted: boolean,
	noUserInput: boolean,
	startConversation: () => void,
	setSituationBranch: () => void,
	defineDirectorStatus: string => void,
	isAutoentrepreneur: boolean => void,
	plafondAutoEntrepreneurDépassé: boolean
}

type SimulationResult = {
	retraite: RègleAvecMontant,
	revenuNet: RègleAvecMontant
}

const SchemeComparaison = ({
	/* Own Props */
	hideAutoEntrepreneur = false,
	hideAssimiléSalarié = false,
	/* Injected Props */
	assimiléSalarié,
	indépendant,
	plafondAutoEntrepreneurDépassé,
	autoEntrepreneur,
	conversationStarted,
	defineDirectorStatus,
	isAutoentrepreneur,
	// setSituationBranch,
	startConversation
}: Props) => {
	const [showMore, setShowMore] = useState(false)
	return (
		<div
			className={classnames('comparaison-grid', {
				hideAutoEntrepreneur,
				hideAssimiléSalarié
			})}>
			<h2 className="AS">
				{emoji('☂')}{' '}
				<span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
					<T>Assimilé salarié</T>
				</span>
				<small>
					<T k="comparaisonRégimes.AS.tagline">Le régime tout compris</T>
				</small>
			</h2>
			<h2 className="indep">
				{emoji('👩‍🔧')}{' '}
				<span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
					<T>Indépendant</T>
				</span>
				<small>
					<T k="comparaisonRégimes.indep.tagline">La protection à la carte</T>
				</small>
			</h2>
			<h2 className="auto">
				{emoji('🚶‍♂️')}{' '}
				<span style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
					<T>Auto-entrepreneur</T>
				</span>
				<small>
					<T k="comparaisonRégimes.auto.tagline">Pour les petites activités</T>
				</small>
			</h2>

			<h3 className="legend">
				<T k="comparaisonRégimes.status.legend">Statuts juridiques possibles</T>
			</h3>
			<div className="AS">
				<T k="comparaisonRégimes.status.AS">SAS, SASU, SARL minoritaire</T>
			</div>
			<div className="indep">
				<T k="comparaisonRégimes.status.indep">EI, EURL, SARL majoritaire</T>
			</div>
			<div className="auto">
				<T k="comparaisonRégimes.status.auto">Micro-entreprise</T>
			</div>

			{!hideAssimiléSalarié && (
				<>
					<T k="comparaisonRégimes.sécuritéSociale">
						<h3 className="legend">Sécurité sociale</h3>
						<div className="AS">Régime général</div>
						<div className="indep-et-auto">
							Sécurité sociale des indépendants (SSI)
						</div>
					</T>
					<T k="comparaisonRégimes.AT">
						<h3 className="legend">Accidents du travail couverts</h3>
					</T>
					<div className="AS">
						<T>
							<T>Oui</T>
						</T>
					</div>
					<div className="indep-et-auto">
						<T>Non</T>
					</div>
					<T k="comparaisonRégimes.assuranceMaladie">
						<h3 className="legend">Assurance maladie</h3>
					</T>
					<div className="green AS">++</div>
					<div className="green indep-et-auto">+</div>
					<T k="comparaisonRégimes.indemnités">
						<h3 className="legend">Indemnités journalières</h3>
					</T>
					<div className="green AS">++</div>
					<div className="indep-et-auto green">+</div>
				</>
			)}
			{!hideAutoEntrepreneur && (
				<T k="comparaisonRégimes.plafondCA">
					<h3 className="legend">Plafond de chiffre d'affaire</h3>
					<div className="AS-et-indep">
						<T>Non</T>
					</div>
					<ul
						className="auto"
						style={{ textAlign: 'left', justifyContent: 'start', margin: 0 }}>
						<li>70 000 € en services</li>
						<li>170 000 € en vente de biens, restauration ou hébergement</li>
					</ul>
				</T>
			)}
			{!conversationStarted && (
				<>
					<T k="comparaisonRégimes.retraite">
						<h3 className="legend">Retraite</h3>
					</T>
					<div className="green AS">++</div>
					<div className="green indep">+</div>
					<div className="red auto">−</div>
				</>
			)}

			{conversationStarted && (
				<>
					<T k="comparaisonRégimes.période">
						<h3 className="legend">Période</h3>
					</T>
					<div className="AS-indep-et-auto">
						<PeriodSwitch />
					</div>
				</>
			)}
			<div className="all">
				{!conversationStarted ? (
					<T k="comparaisonRégimes.simulationText">
						<h2>Comparez vos revenus et votre retraite en 1 minute</h2>
						<button
							className="ui__ cta plain button"
							onClick={() => startConversation()}>
							Commencer
						</button>
					</T>
				) : (
					<div className="ui__ container" style={{ marginTop: '2rem' }}>
						<Simulation />
					</div>
				)}
			</div>

			{conversationStarted && (
				<>
					<T k="comparaisonRégimes.revenuNet">
						<h3 className="legend">Revenu net après impôts</h3>
					</T>
					<div className="AS">
						{assimiléSalarié && (
							<Animate.appear className="ui__ plain card">
								<AnimatedTargetValue
									value={assimiléSalarié.revenuNet.montant}
								/>
							</Animate.appear>
						)}
					</div>
					<div className="indep">
						{indépendant && (
							<Animate.appear className="ui__ plain card">
								<AnimatedTargetValue value={indépendant.revenuNet.montant} />
							</Animate.appear>
						)}
					</div>
					<div className="auto">
						{autoEntrepreneur && (
							<Animate.appear
								className={classnames(
									'ui__ plain card',
									plafondAutoEntrepreneurDépassé && 'disabled'
								)}>
								{plafondAutoEntrepreneurDépassé ? (
									'Plafond de CA dépassé'
								) : (
									<AnimatedTargetValue
										value={autoEntrepreneur.revenuNet.montant}
									/>
								)}
							</Animate.appear>
						)}
					</div>
					<T k="comparaisonRégimes.retraite">
						<h3 className="legend">Retraite (estimation)</h3>
					</T>
					<div className="AS">
						{assimiléSalarié && (
							<AnimatedTargetValue value={assimiléSalarié.retraite.montant} />
						)}
					</div>
					<div className="indep">
						{indépendant && indépendant.retraite.montant !== 0 ? (
							<AnimatedTargetValue value={indépendant.retraite.montant} />
						) : (
							<span className="ui__ notice">Pas implémenté</span>
						)}
					</div>
					<div className="auto">
						{autoEntrepreneur && (
							<AnimatedTargetValue value={autoEntrepreneur.retraite.montant} />
						)}
					</div>
				</>
			)}

			{showMore ? (
				<>
					{!hideAutoEntrepreneur && (
						<>
							<T k="comparaisonRégimes.ACCRE">
								<h3 className="legend">ACCRE</h3>
								<div className="AS-et-indep">Une année, plafonné</div>
								<div className="auto">
									3 années, progressif, <T>non</T> plafonné
								</div>
							</T>
							<T k="comparaisonRégimes.déduction">
								<h3 className="legend">Déduction des charges</h3>
								<div className="AS-et-indep">Régime réel </div>
								<div className="auto">Abattement forfaitaire </div>
							</T>
						</>
					)}
					<T k="comparaisonRégimes.cotisations">
						<h3 className="legend">Paiment des cotisations</h3>
						<div className="AS">Mensuel (à la source)</div>
						<div className="indep">Annuel avec deux ans de décalage</div>
						<div className="auto">Mensuel ou trimestriel</div>
					</T>
					<T k="comparaisonRégimes.complémentaireDeductible">
						<h3 className="legend">
							Complémentaires retraite et santé déductibles
						</h3>
						<div className="AS">Oui (jusqu'à 50%)</div>
						<div className="indep">Oui (Loi Madelin)</div>
					</T>
					<div className="auto">
						<T>Non</T>
					</div>
					<T k="comparaisonRégimes.cotisationMinimale">
						<h3 className="legend">Cotisations minimales</h3>
					</T>
					<div className="AS">
						<T>Non</T>
					</div>
					<div className="indep">
						<T>Oui</T>
					</div>
					<div className="auto">
						<T>Non</T>
					</div>
					<T k="comparaisonRégimes.seuil">
						<h3 className="legend">Seuil d'activation des droits</h3>
					</T>
					<div className="AS">
						<T>Oui</T>
					</div>
					<div className="indep">
						<T>Non</T>
					</div>
					<div className="auto">
						<T>Oui</T>
					</div>
				</>
			) : (
				<T k="comparaisonRégimes.comparaisonDétaillée">
					<h3 className="legend">Comparaison détaillée</h3>
					<div className="AS-indep-et-auto">
						<button
							onClick={() => setShowMore(true)}
							className="ui__ simple small button">
							Afficher la comparaison détaillée
						</button>
					</div>
				</T>
			)}
			<T k="comparaisonRégimes.comptabilité">
				<h3 className="legend">Comptabilité</h3>
				<div className="AS">Expert</div>
				<div className="indep">Compliquée</div>
				<div className="auto">Simplifiée</div>
			</T>
			<div className="AS no-border">
				<button
					className="ui__  button"
					onClick={() => {
						!hideAssimiléSalarié && defineDirectorStatus('SALARIED')
						!hideAutoEntrepreneur && isAutoentrepreneur(false)
					}}>
					<T k="comparaisonRégimes.choix.AS">Choisir assimilé&nbsp;salarié</T>
				</button>
			</div>
			<div className="indep no-border">
				<button
					className="ui__  button"
					onClick={() => {
						!hideAssimiléSalarié && defineDirectorStatus('SELF_EMPLOYED')
						!hideAutoEntrepreneur && isAutoentrepreneur(false)
					}}>
					<T k="comparaisonRégimes.choix.indep">Choisir indépendant</T>
				</button>
			</div>
			<div className="auto no-border">
				<button
					className="ui__ button"
					onClick={() => {
						!hideAssimiléSalarié && defineDirectorStatus('SELF_EMPLOYED')
						!hideAutoEntrepreneur && isAutoentrepreneur(true)
					}}>
					<T k="comparaisonRégimes.choix.auto">Choisir auto-entrepreneur</T>
				</button>
			</div>
		</div>
	)
}

export default (compose(
	connect(
		state => {
			const analyse = branchAnalyseSelector(state, {
				situationBranchName: 'Auto-entrepreneur'
			})

			return {
				plafondAutoEntrepreneurDépassé:
					analyse.controls &&
					analyse.controls.find(({ test }) =>
						test.includes('base des cotisations > plafond')
					),
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
			}
		},
		{ startConversation, defineDirectorStatus, isAutoentrepreneur }
	),
	withSimulationConfig(ComparaisonConfig)
)(SchemeComparaison): React$Component<OwnProps>)
