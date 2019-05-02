/* @flow */
import { setSituationBranch } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import React from 'react'
import { connect } from 'react-redux'
import { branchAnalyseSelector } from 'Selectors/analyseSelectors'
import { règleAvecMontantSelector } from 'Selectors/regleSelectors'
import Animate from 'Ui/animate'
import Montant from 'Ui/Montant'
import { noUserInputSelector } from '../selectors/analyseSelectors'
import './ComparativeTargets.css'
import SchemeCard from './ui/SchemeCard'

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

type ComparativeTargetsProps = {
	plafondAutoEntrepreneurDépassé: ?{ message: string }
}
const ComparativeTargets: React$ComponentType<{}> = connect(state => {
	const analyse = branchAnalyseSelector(state, {
		situationBranchName: 'Auto-entrepreneur'
	})
	return {
		plafondAutoEntrepreneurDépassé:
			analyse.controls &&
			analyse.controls.find(({ test }) =>
				test.includes('base des cotisations > plafond')
			)
	}
})(({ plafondAutoEntrepreneurDépassé }: ComparativeTargetsProps) => (
	<Animate.fromBottom>
		<div className="ui__ full-width">
			<PeriodSwitch />
			<div className="comparative-targets ">
				<AutoEntrepreneur
					branchIndex={0}
					plafondDépassé={
						plafondAutoEntrepreneurDépassé &&
						plafondAutoEntrepreneurDépassé.message
					}
				/>
				<AssimiléSalarié branchIndex={2} />
				<Indépendant branchIndex={1} />
			</div>
		</div>
	</Animate.fromBottom>
))

const Indépendant = connectRègles('Indépendant')(
	({
		revenuDisponible,
		branchIndex,
		setSituationBranch,
		defineDirectorStatus,
		retraite,
		isAutoentrepreneur
	}) => (
		<SchemeCard
			title="Indépendant"
			subtitle="La protection à la carte"
			onAmountClick={() => setSituationBranch(branchIndex)}
			amount={revenuDisponible.montant}
			icon="👩‍🔧"
			amountDesc={<RuleLink {...revenuDisponible} />}
			features={[
				retraite.montant && (
					<>
						<RuleLink {...retraite} /> : <Montant>{retraite.montant}</Montant>
					</>
				),
				'Régime des indépendants',
				'Complémentaire santé et prévoyance non incluses',
				'Accidents du travail non couverts',
				'Retraite faible (41% du dernier brut)',
				'Indemnités journalières plus faibles',
				'Montant minimum de cotisations',
				'Cotisations en décalage de deux ans'
			].filter(Boolean)}
			onSchemeChoice={() => {
				defineDirectorStatus('SELF_EMPLOYED')
				isAutoentrepreneur(false)
			}}
		/>
	)
)

const AssimiléSalarié = connectRègles('Assimilé salarié')(
	({
		revenuDisponible,
		branchIndex,
		setSituationBranch,
		defineDirectorStatus,
		retraite
	}) => (
		<SchemeCard
			title="Assimilé salarié"
			onAmountClick={() => setSituationBranch(branchIndex)}
			subtitle="Le régime tout compris"
			amount={revenuDisponible.montant}
			featured="Le choix de 58% des dirigeants de sociétés"
			icon="☂"
			amountDesc={<RuleLink {...revenuDisponible} />}
			features={[
				retraite.montant && (
					<>
						<RuleLink {...retraite} /> : <Montant>{retraite.montant}</Montant>
					</>
				),
				'Régime général',
				'Complémentaires santé et prévoyance incluses',
				'Accidents du travail couverts',
				'Retraite élevée (62 % du dernier brut)',
				'Pas de cotisations minimales',
				"Seuil pour l'activation des droits (4000€/an)",
				'Fiches de paie mensuelles',
				'Prélèvement des cotisations à la source'
			].filter(Boolean)}
			onSchemeChoice={() => {
				defineDirectorStatus('SALARIED')
				isAutoentrepreneur(false)
			}}
		/>
	)
)

const AutoEntrepreneur = connectRègles('Auto-entrepreneur')(
	({
		revenuDisponible,
		setSituationBranch,
		isAutoentrepreneur,
		retraite,
		branchIndex,
		plafondDépassé
	}) => {
		return (
			<SchemeCard
				title="Auto-entrepreneur"
				subtitle="Pour les petites activités"
				onAmountClick={() => setSituationBranch(branchIndex)}
				disabled={plafondDépassé}
				amountDesc={<RuleLink {...revenuDisponible} />}
				icon="🚶‍♂️"
				amount={revenuDisponible.montant}
				features={[
					retraite.montant && (
						<>
							<RuleLink {...retraite} /> : <Montant>{retraite.montant}</Montant>
						</>
					),
					'Régime des indépendants',
					'Pas de déduction des charges',
					'Pas de déduction fiscale pour la mutuelle (Madelin)',
					"Chiffre d'affaires plafonné",
					"Durée de l'ACRE plus élevée",
					'Comptabilité réduite au minimum'
				].filter(Boolean)}
				onSchemeChoice={() => {
					defineDirectorStatus('SELF_EMPLOYED')
					isAutoentrepreneur(true)
				}}
			/>
		)
	}
)

export default ComparativeTargets
