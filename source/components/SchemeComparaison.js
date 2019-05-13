/* @flow */
import { setSituationBranch, startConversation } from 'Actions/actions'
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
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, tryCatch } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
	assimiléSalarié?: SimulationResult,
	indépendant?: SimulationResult,
	autoEntrepreneur?: SimulationResult,
	conversationStarted: boolean,
	startConversation: () => void,
	setSituationBranch: number => void,
	defineDirectorStatus: string => void,
	sitePaths: any,
	isAutoentrepreneur: boolean => void,
	plafondAutoEntrepreneurDépassé: boolean
}

type SimulationResult = {
	retraite: RègleAvecMontant,
	revenuNetAvantImpôts: RègleAvecMontant,
	revenuNetAprèsImpôts: RègleAvecMontant,
	plafondDépassé?: boolean
}

const SchemeComparaison = ({
	/* Own Props */
	hideAutoEntrepreneur = false,
	hideAssimiléSalarié = false,
	/* Injected Props */
	assimiléSalarié,
	indépendant,
	autoEntrepreneur,
	conversationStarted,
	defineDirectorStatus,
	isAutoentrepreneur,
	setSituationBranch,
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
					{hideAssimiléSalarié ? (
						<T>Entreprise Individuelle</T>
					) : (
						<T>Indépendant</T>
					)}
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
						<h3 className="legend">Couverture accidents du travail</h3>
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

			{!conversationStarted && (
				<>
					<T k="comparaisonRégimes.retraite">
						<h3 className="legend">Retraite</h3>
					</T>
					<div className="green AS">+++</div>
					<div className="green indep">++</div>
					<div className="green auto">+</div>
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
						<h2 style={{ margin: '1rem' }}>
							Comparez vos revenus et votre retraite en 1 minute
						</h2>
						<button
							className="ui__ cta plain button"
							onClick={() => startConversation()}>
							Commencer
						</button>
					</T>
				) : (
					<div className="ui__ container">
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
								<RuleValueLink
									onClick={() => setSituationBranch(0)}
									{...assimiléSalarié.revenuNetAprèsImpôts}
								/>
							</Animate.appear>
						)}
					</div>
					<div className="indep">
						{indépendant && (
							<Animate.appear className="ui__ plain card">
								<RuleValueLink
									onClick={() => setSituationBranch(1)}
									{...indépendant.revenuNetAprèsImpôts}
								/>
							</Animate.appear>
						)}
					</div>
					<div className="auto">
						{autoEntrepreneur && (
							<Animate.appear
								className={classnames(
									'ui__ plain card',
									autoEntrepreneur.plafondDépassé && 'disabled'
								)}>
								{autoEntrepreneur.plafondDépassé ? (
									'Plafond de CA dépassé'
								) : (
									<RuleValueLink
										onClick={() => setSituationBranch(2)}
										{...autoEntrepreneur.revenuNetAprèsImpôts}
									/>
								)}
							</Animate.appear>
						)}
					</div>
					<T k="comparaisonRégimes.revenuNet">
						<h3 className="legend">Revenu net de cotisations (avant impôts)</h3>
					</T>
					<div className="AS">
						{assimiléSalarié && (
							<Animate.appear>
								<RuleValueLink
									onClick={() => setSituationBranch(0)}
									{...assimiléSalarié.revenuNetAvantImpôts}
								/>
							</Animate.appear>
						)}
					</div>
					<div className="indep">
						{indépendant && (
							<Animate.appear>
								<RuleValueLink
									onClick={() => setSituationBranch(1)}
									{...indépendant.revenuNetAvantImpôts}
								/>
							</Animate.appear>
						)}
					</div>
					<div className="auto">
						{autoEntrepreneur && (
							<Animate.appear>
								{autoEntrepreneur.plafondDépassé ? (
									'—'
								) : (
									<RuleValueLink
										onClick={() => setSituationBranch(2)}
										{...autoEntrepreneur.revenuNetAvantImpôts}
									/>
								)}
							</Animate.appear>
						)}
					</div>
					<T k="comparaisonRégimes.retraite">
						<h3 className="legend">Retraite (estimation)</h3>
					</T>
					<div className="AS">
						{assimiléSalarié && assimiléSalarié.retraite.montant !== 0 ? (
							<RuleValueLink
								onClick={() => setSituationBranch(1)}
								{...assimiléSalarié.retraite}
								garder
								une
								trace
							/>
						) : (
							<span className="ui__ notice">Pas implémenté</span>
						)}
					</div>
					<div className="indep">
						{indépendant && indépendant.retraite.montant !== 0 ? (
							<RuleValueLink
								onClick={() => setSituationBranch(1)}
								{...indépendant.retraite}
							/>
						) : (
							<span className="ui__ notice">Pas implémenté</span>
						)}
					</div>
					<div className="auto">
						{autoEntrepreneur &&
							(autoEntrepreneur.plafondDépassé ? (
								'—'
							) : autoEntrepreneur.retraite.montant !== 0 ? (
								<RuleValueLink
									onClick={() => setSituationBranch(1)}
									{...autoEntrepreneur.retraite}
								/>
							) : (
								<span className="ui__ notice">Pas implémenté</span>
							))}
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
			{!hideAutoEntrepreneur && (
				<T k="comparaisonRégimes.plafondCA">
					<h3 className="legend">Plafond de chiffre d'affaires</h3>
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
			<T k="comparaisonRégimes.comptabilité">
				<h3 className="legend">Comptabilité</h3>
				<div className="AS">Experte</div>
				<div className="indep">Complexe</div>
				<div className="auto">Simple</div>
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
					{hideAssimiléSalarié ? (
						<T k="comparaisonRégimes.choix.EI">
							Choisir entreprise individuelle
						</T>
					) : (
						<T k="comparaisonRégimes.choix.indep">Choisir indépendant</T>
					)}
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

const RuleValueLink = withSitePaths(
	({
		lien,
		montant,
		sitePaths,
		onClick
	}: RègleAvecMontant & { sitePaths: any, onClick: () => void }) => (
		<Link onClick={onClick} to={sitePaths.documentation.index + '/' + lien}>
			<AnimatedTargetValue value={montant} />
		</Link>
	)
)

export default (compose(
	withSimulationConfig(ComparaisonConfig),
	connect(
		tryCatch(
			state => ({
				conversationStarted: state.conversationStarted,
				autoEntrepreneur: {
					retraite: règleAvecMontantSelector(state, {
						situationBranchName: 'Auto-entrepreneur'
					})('protection sociale . retraite'),
					revenuNetAprèsImpôts: règleAvecMontantSelector(state, {
						situationBranchName: 'Auto-entrepreneur'
					})('revenu net'),
					revenuNetAvantImpôts: règleAvecMontantSelector(state, {
						situationBranchName: 'Auto-entrepreneur'
					})('auto entrepreneur . revenu net de cotisations'),
					// $FlowFixMe
					plafondDépassé: branchAnalyseSelector(state, {
						situationBranchName: 'Auto-entrepreneur'
					}).controls?.find(
						({ test }) =>
							test.includes && test.includes('base des cotisations > plafond')
					)
				},
				indépendant: {
					retraite: règleAvecMontantSelector(state, {
						situationBranchName: 'Indépendant'
					})('protection sociale . retraite'),
					revenuNetAprèsImpôts: règleAvecMontantSelector(state, {
						situationBranchName: 'Indépendant'
					})('revenu net'),
					revenuNetAvantImpôts: règleAvecMontantSelector(state, {
						situationBranchName: 'Indépendant'
					})('indépendant . revenu professionnel')
				},
				assimiléSalarié: {
					retraite: règleAvecMontantSelector(state, {
						situationBranchName: 'Assimilé salarié'
					})('protection sociale . retraite'),
					revenuNetAprèsImpôts: règleAvecMontantSelector(state, {
						situationBranchName: 'Assimilé salarié'
					})('revenu net'),
					revenuNetAvantImpôts: règleAvecMontantSelector(state, {
						situationBranchName: 'Assimilé salarié'
					})('contrat salarié . salaire . net')
				}
			}),
			(e, state) =>
				console.log(e) || { conversationStarted: state.conversationStarted }
		),

		{
			startConversation,
			defineDirectorStatus,
			isAutoentrepreneur,
			setSituationBranch
		}
	)
)(SchemeComparaison): React$Component<OwnProps>)
