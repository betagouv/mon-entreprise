/* @flow */
import { startConversation } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import classnames from 'classnames'
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

			<h3 className="legend">Statuts juridiques possibles</h3>
			<div className="AS">SAS, SASU, SARL minoritaire</div>
			<div className="indep">EI, EURL, SARL majoritaire</div>
			<div className="auto">Micro-entreprise</div>

			{!hideAssimiléSalarié && (
				<>
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
				</>
			)}
			{!hideAutoEntrepreneur && (
				<>
					<h3 className="legend">Plafond de chiffre d'affaire</h3>
					<div className="AS-et-indep">Non</div>
					<div className="auto" style={{ textAlign: 'left' }}>
						<ul>
							<li>70 000 € en services</li>
							<li>170 000 € en vente de biens, restauration ou hébergement</li>
						</ul>
					</div>
				</>
			)}
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
					<h3 className="legend">Revenu net après impôts</h3>
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

					<h3 className="legend">Retraite (estimation)</h3>
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
							<h3 className="legend">ACCRE</h3>
							<div className="AS-et-indep">Une année, plafonné</div>
							<div className="auto">3 années, progressif, non plafonné</div>

							<h3 className="legend">Déduction des charges</h3>
							<div className="AS-et-indep">Régime réel </div>
							<div className="auto">Abattement forfaitaire </div>
						</>
					)}
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
							className="ui__ simple small button">
							Afficher la comparaison détaillée
						</button>
					</div>
				</>
			)}
			<h3 className="legend">Comptabilité</h3>
			<div className="AS">Expert</div>
			<div className="indep">Compliquée</div>
			<div className="auto">Simplifiée</div>
			<div className="AS no-border">
				<button
					className="ui__  button"
					onClick={() => {
						!hideAssimiléSalarié && defineDirectorStatus('SALARIED')
						!hideAutoEntrepreneur && isAutoentrepreneur(false)
					}}>
					Choisir assimilé&nbsp;salarié
				</button>
			</div>
			<div className="indep no-border">
				<button
					className="ui__  button"
					onClick={() => {
						!hideAssimiléSalarié && defineDirectorStatus('SELF_EMPLOYED')
						!hideAutoEntrepreneur && isAutoentrepreneur(false)
					}}>
					Choisir indépendant
				</button>
			</div>
			<div className="auto no-border">
				<button
					className="ui__ button"
					onClick={() => {
						!hideAssimiléSalarié && defineDirectorStatus('SELF_EMPLOYED')
						!hideAutoEntrepreneur && isAutoentrepreneur(true)
					}}>
					Choisir auto-entrepreneur
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
