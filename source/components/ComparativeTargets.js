/* @flow */
import { setSituationBranch } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { règleAvecMontantSelector } from 'Selectors/regleSelectors'
import { noUserInputSelector } from '../selectors/analyseSelectors'
import './ComparativeTargets.css'

import type { RègleAvecMontant } from 'Types/RegleTypes'

const connectRègles = (situationBranchName: string) =>
	connect(
		state => {
			return ({
				revenuDisponible:
					!noUserInputSelector(state) &&
					règleAvecMontantSelector(state, {
						situationBranchName
					})('revenu net'),
				retraite:
					!noUserInputSelector(state) &&
					règleAvecMontantSelector(state, {
						situationBranchName
					})('protection sociale . retraite')
			}: {
				revenuDisponible: boolean | RègleAvecMontant,
				retraite: boolean | RègleAvecMontant
			})
		},
		{
			setSituationBranch,
			isAutoentrepreneur,
			defineDirectorStatus
		}
	)

const ComparativeTargets = () => (
	<div className="ui__ full-width">
		<div className="comparaison-grid ">
			<h2 className="AS">
				☂ Assimilé salarié
				<small>Le régime tout compris</small>
			</h2>
			<h2 className="indep">
				👩‍🔧 Indépendant
				<small>La protection à la carte</small>
			</h2>
			<h2 className="auto">
				🚶‍♂️ Auto-entrepreneur
				<small>Pour les petites activités</small>
			</h2>

			<div className="legend">Sécurité sociale</div>
			<div className="AS">Régime général</div>
			<div className="indep-et-auto">
				Sécurité sociale des indépendants (SSI)
			</div>

			<div className="legend">Retraite</div>
			<div className="green AS">++</div>
			<div className="green indep">+</div>
			<div className="red auto">−</div>

			<div className="legend">Assurance maladie</div>
			<div className="green AS">++</div>
			<div className="green indep-et-auto">+</div>

			<div className="legend">Indémnités journalières</div>
			<div className="green AS">++</div>
			<div className="indep-et-auto green">+</div>

			<div className="legend">Accidents du travail </div>
			<div className="AS">Couverts</div>
			<div className="indep-et-auto">Non couverts</div>
			<div className="all">
				<h3>Comparez vos revenus et votre retraite en 1 minute</h3>
				<button className="ui__ cta plain button">Commencer</button>
			</div>
			<div className="legend">Paiment des cotisations</div>
			<div className="AS">Mensuel (à la source)</div>
			<div className="indep">Annuel avec deux ans de décalage</div>
			<div className="auto">Mensuel ou trimestriel</div>

			<div className="legend">ACCRE</div>
			<div className="AS-et-indep">Une année, plafonné</div>
			<div className="auto">3 années, progressif, non plafonné</div>

			<div className="legend">Déduction des charges</div>
			<div className="AS-et-indep">Régime réel </div>
			<div className="auto">Abattement forfaitaire </div>

			<div className="legend">Comptabilité</div>
			<div className="AS">Expert 😩</div>
			<div className="indep">Compliquée 😔</div>
			<div className="auto">Simplifiée 😌</div>

			<div className="legend">
				Complémentaires retraite et santé déductibles
			</div>
			<div className="AS">Oui (jusqu'à 50%)</div>
			<div className="indep">Oui (Loi Madelin)</div>
			<div className="auto">Non</div>

			<button className="AS ui__ button">Choisir ce régime</button>
			<button className="indep ui__ button">Choisir ce régime</button>
			<button className="auto ui__ button">Choisir ce régime</button>
		</div>
	</div>
)

// const Indépendant = connectRègles('Indépendant')(
// 	({
// 		revenuDisponible,
// 		branchIndex,
// 		setSituationBranch,
// 		defineDirectorStatus,
// 		retraite,
// 		isAutoentrepreneur
// 	}) => (
// 		<SchemeCard
// 			title="Indépendant"
// 			subtitle="La protection à la carte"
// 			onAmountClick={() => setSituationBranch(branchIndex)}
// 			amount={revenuDisponible.montant}
// 			icon="👩‍🔧"
// 			amountDesc={<RuleLink {...revenuDisponible} />}
// 			features={[
// 				retraite.montant && (
// 					<>
// 						<RuleLink {...retraite} /> : <Montant>{retraite.montant}</Montant>
// 					</>
// 				),
// 				'Régime des indépendants',
// 				'Complémentaire santé et prévoyance non incluses',
// 				'Accidents du travail non couverts',
// 				'Retraite faible (41% du dernier brut)',
// 				'Indemnités journalières plus faibles',
// 				'Montant minimum de cotisations',
// 				'Cotisations en décalage de deux ans'
// 			].filter(Boolean)}
// 			onSchemeChoice={() => {
// 				defineDirectorStatus('SELF_EMPLOYED')
// 				isAutoentrepreneur(false)
// 			}}
// 		/>
// 	)
// )

// const AssimiléSalarié = connectRègles('Assimilé salarié')(
// 	({
// 		revenuDisponible,
// 		branchIndex,
// 		setSituationBranch,
// 		defineDirectorStatus,
// 		retraite
// 	}) => (
// 		<SchemeCard
// 			title="Assimilé salarié"
// 			onAmountClick={() => setSituationBranch(branchIndex)}
// 			subtitle="Le régime tout compris"
// 			amount={revenuDisponible.montant}
// 			featured="Le choix de 58% des dirigeants de sociétés"
// 			icon="☂"
// 			amountDesc={<RuleLink {...revenuDisponible} />}
// 			features={[
// 				retraite.montant && (
// 					<>
// 						<RuleLink {...retraite} /> : <Montant>{retraite.montant}</Montant>
// 					</>
// 				),
// 				'Régime général',
// 				'Complémentaires santé et prévoyance incluses',
// 				'Accidents du travail couverts',
// 				'Retraite élevée (62 % du dernier brut)',
// 				'Pas de cotisations minimales',
// 				"Seuil pour l'activation des droits (4000€/an)",
// 				'Fiches de paie mensuelles',
// 				'Prélèvement des cotisations à la source'
// 			].filter(Boolean)}
// 			onSchemeChoice={() => {
// 				defineDirectorStatus('SALARIED')
// 				isAutoentrepreneur(false)
// 			}}
// 		/>
// 	)
// )

// const AutoEntrepreneur = connectRègles('Auto-entrepreneur')(
// 	({
// 		revenuDisponible,
// 		setSituationBranch,
// 		isAutoentrepreneur,
// 		retraite,
// 		branchIndex,
// 		plafondDépassé
// 	}) => {
// 		return (
// 			<SchemeCard
// 				title="Auto-entrepreneur"
// 				subtitle="Pour les petites activités"
// 				onAmountClick={() => setSituationBranch(branchIndex)}
// 				disabled={plafondDépassé}
// 				amountDesc={<RuleLink {...revenuDisponible} />}
// 				icon="🚶‍♂️"
// 				amount={revenuDisponible.montant}
// 				features={[
// 					retraite.montant && (
// 						<>
// 							<RuleLink {...retraite} /> : <Montant>{retraite.montant}</Montant>
// 						</>
// 					),
// 					'Régime des indépendants',
// 					'Pas de déduction des charges',
// 					'Pas de déduction fiscale pour la mutuelle (Madelin)',
// 					"Chiffre d'affaires plafonné",
// 					"Durée de l'ACRE plus élevée",
// 					'Comptabilité réduite au minimum'
// 				].filter(Boolean)}
// 				onSchemeChoice={() => {
// 					defineDirectorStatus('SELF_EMPLOYED')
// 					isAutoentrepreneur(true)
// 				}}
// 			/>
// 		)
// 	}
// )

export default ComparativeTargets
