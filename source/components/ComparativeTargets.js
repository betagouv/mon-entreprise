/* @flow */
import { setSituationBranch } from 'Actions/actions'
import {
	companyIsMicroenterprise,
	defineDirectorStatus
} from 'Actions/companyStatusActions'
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
import './ComparativeTargets.css'
import SchemeCard from './ui/SchemeCard'

const connectRègles = (situationBranchName: string) =>
	connect(
		state => ({
			revenuDisponible: règleAvecMontantSelector(state, {
				situationBranchName
			})('revenu disponible'),
			prélèvements: règleAvecValeurSelector(state, {
				situationBranchName
			})('ratio de prélèvements'),
			analysis: branchAnalyseSelector(state, {
				situationBranchName
			})
		}),
		{
			setSituationBranch,
			companyIsMicroenterprise,
			defineDirectorStatus
		}
	)

const ComparativeTargets = () => (
	<Animate.fromBottom config={config.gentle}>
		<div
			className="ui__ full-width"
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignItems: 'stretch'
			}}>
			<MicroEntreprise branchIndex={0} />
			<AssimiléSalarié branchIndex={2} />
			<Indépendant branchIndex={1} />
		</div>
	</Animate.fromBottom>
)

const Indépendant = connectRègles('Indépendant')(
	({
		revenuDisponible,
		prélèvements,
		branchIndex,
		setSituationBranch,
		defineDirectorStatus,
		companyIsMicroenterprise
	}) => (
		<SchemeCard
			title="Indépendants"
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
				companyIsMicroenterprise(false)
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
			onSchemeChoice={() => defineDirectorStatus('SALARIED')}
		/>
	)
)

const MicroEntreprise = connectRègles('Micro-entreprise')(
	({
		revenuDisponible,
		prélèvements,
		setSituationBranch,
		companyIsMicroenterprise,
		branchIndex,
		analysis
	}) => {
		const disabledMessage = (
			(analysis.controls &&
				analysis.controls.find(({ test }) =>
					test.includes('base des cotisations > plafond')
				)) ||
			{}
		).message
		return (
			<SchemeCard
				title="Micro-entreprise"
				subtitle="Pour les petites activités"
				onAmountClick={() => setSituationBranch(branchIndex)}
				disabled={
					disabledMessage && (
						<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F32353">
							{disabledMessage}
						</a>
					)
				}
				amountDesc={<RuleLink {...revenuDisponible} />}
				icon="🚶‍♂️"
				amountNotice={<PrélèvementNotice prélèvements={prélèvements} />}
				amount={revenuDisponible.montant}
				features={[
					'Régime des indépendants',
					'Pas de déduction des charges',
					'Pas de déduction fiscale pour la mutuelle (Madelin)',
					"Seuil de chiffre d'affaires",
					"Durée de l'ACCRE plus élevée",
					'Comptabilité réduite au minimum'
				]}
				onSchemeChoice={() => companyIsMicroenterprise(true)}
			/>
		)
	}
)

const PrélèvementNotice = withSitePaths(({ prélèvements, sitePaths }) => (
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
))
export default ComparativeTargets
