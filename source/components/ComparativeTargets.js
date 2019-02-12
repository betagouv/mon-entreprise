/* @flow */
import { setSituationBranch } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { config } from 'react-spring'
import { branchAnalyseSelector } from 'Selectors/analyseSelectors'
import {
	règleAvecMontantSelector,
	règleAvecValeurSelector
} from 'Selectors/regleSelectors'
import Animate from 'Ui/animate'
import Montant from 'Ui/Montant'
import { noUserInputSelector } from '../selectors/analyseSelectors'
import './ComparativeTargets.css'
import SchemeCard from './ui/SchemeCard'
import type {
	Règle,
	RègleAvecMontant,
	RègleValeur,
	RègleAvecValeur
} from 'Types/RegleTypes'

const connectRègles = (situationBranchName: string) =>
	connect(
		state => {
			return ({
				revenuDisponible:
					!noUserInputSelector(state) &&
					règleAvecMontantSelector(state, {
						situationBranchName
					})('revenu disponible'),
				prélèvements:
					!noUserInputSelector(state) &&
					règleAvecValeurSelector(state, {
						situationBranchName
					})('ratio de prélèvements')
			}: {
				revenuDisponible: RègleAvecMontant,
				prélèvements: RègleAvecValeur
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
	<Animate.fromBottom config={config.gentle}>
		<div
			className="ui__ full-width"
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignItems: 'stretch'
			}}>
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
		<PeriodSwitch />
	</Animate.fromBottom>
))

const Indépendant = connectRègles('Indépendant')(
	({
		revenuDisponible,
		prélèvements,
		branchIndex,
		setSituationBranch,
		defineDirectorStatus,
		isAutoentrepreneur
	}) => (
		<SchemeCard
			title="Indépendant"
			subtitle="La protection à la carte"
			onAmountClick={() => setSituationBranch(branchIndex)}
			amount={revenuDisponible.montant}
			amountNotice={<PrélèvementNotice prélèvements={prélèvements} />}
			icon="👩‍🔧"
			amountDesc={<RuleLink {...revenuDisponible} />}
			features={[
				'Régime des indépendants',
				'Complémentaire santé et prévoyance non incluses',
				'Accidents du travail non couverts',
				'Retraite faible (41% du dernier brut)',
				'Indemnités journalières plus faibles',
				'Montant minimum de cotisations',
				'Cotisations en décalage de deux ans'
			]}
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
		prélèvements,
		branchIndex,
		setSituationBranch,
		defineDirectorStatus
	}) => (
		<SchemeCard
			title="Assimilé salarié"
			onAmountClick={() => setSituationBranch(branchIndex)}
			subtitle="Le régime tout compris"
			amount={revenuDisponible.montant}
			amountNotice={<PrélèvementNotice prélèvements={prélèvements} />}
			featured="Le choix de 58% des dirigeants de sociétés"
			icon="☂"
			amountDesc={<RuleLink {...revenuDisponible} />}
			features={[
				'Régime général',
				'Complémentaires santé et prévoyance incluses',
				'Accidents du travail couverts',
				'Retraite élevée (62 % du dernier brut)',
				'Pas de cotisations minimales',
				"Seuil pour l'activation des droits (4000€/an)",
				'Fiches de paie mensuelles',
				'Prélèvement des cotisations à la source'
			]}
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
		prélèvements,
		setSituationBranch,
		isAutoentrepreneur,
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
				amountNotice={<PrélèvementNotice prélèvements={prélèvements} />}
				amount={revenuDisponible.montant}
				features={[
					'Régime des indépendants',
					'Pas de déduction des charges',
					'Pas de déduction fiscale pour la mutuelle (Madelin)',
					"Chiffre d'affaires plafonné",
					"Durée de l'ACCRE plus élevée",
					'Comptabilité réduite au minimum'
				]}
				onSchemeChoice={() => {
					defineDirectorStatus('SELF_EMPLOYED')
					isAutoentrepreneur(true)
				}}
			/>
		)
	}
)

type PrélèvementNoticeProps = {
	prélèvements: ?RègleAvecValeur,
	sitePaths: Object
}
const PrélèvementNotice = withSitePaths(
	({ prélèvements, sitePaths }: PrélèvementNoticeProps) =>
		!!prélèvements && (
			<>
				soit{' '}
				<Montant
					style={{ fontFamily: 'inherit' }}
					type="percent"
					numFractionDigit={0}>
					{prélèvements.valeur}
				</Montant>{' '}
				de{' '}
				<Link to={sitePaths.documentation.index + '/' + prélèvements.lien}>
					prélèvements
				</Link>
			</>
		)
)
export default ComparativeTargets
