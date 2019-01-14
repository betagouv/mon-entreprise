/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { config } from 'react-spring'
import { règleAvecMontantSelector } from 'Selectors/regleSelectors'
import Animate from 'Ui/animate'
import './ComparativeTargets.css'
import SchemeCard from './ui/SchemeCard'
// export default compose(
// 	connect(
// 		state => ({
// 			target: findRuleByDottedName(
// 				flatRulesSelector(state),
// 				state.simulationConfig?.objectifs[0]
// 			),
// 			simulationBranches: state.simulationConfig?.branches,
// 			analyses: analysisWithDefaultsSelector(state)
// 		}),
// 		dispatch => ({
// 			setSituationBranch: id => dispatch({ type: 'SET_SITUATION_BRANCH', id })
// 		})
// 	),
// 	withColours,
// 	withSitePaths
// )(
// 	class ComparativeTargets extends React.Component {
// 		render() {
// 			let {
// 				colours,
// 				analyses,
// 				target,
// 				setSituationBranch,
// 				sitePaths,
// 				simulationBranches
// 			} = this.props
// 			if (!simulationBranches) {
// 				return null
// 			}
// 			// We retrieve the values necessary to compute the global % of taxes
// 			// This is not elegant
// 			let getRatioPrélèvements = analysis =>
// 				analysis.targets.find(t => t.dottedName === 'ratio de prélèvements')
// 			return (
// 				<>
// 						{analyses.map((analysis, i) => {
// 							if (!analysis.targets) return null
// 							let { nodeValue, dottedName } = analysis.targets[0],
// 								name = simulationBranches[i].nom

// 							let microNotApplicable =
// 								name === 'Micro-entreprise' &&
// 								analysis.controls?.find(({ test }) =>
// 									test.includes('base des cotisations > plafond')
// 								)

// 							let ratioPrélèvements = getRatioPrélèvements(analysis)

// 							return (
// 								<li
// 									style={{
// 										color: colours.textColour,
// 										background: `linear-gradient(
// 											60deg,
// 											${colours.darkColour} 0%,
// 											${colours.colour} 100%
// 										)`
// 									}}
// 									className={microNotApplicable ? 'microNotApplicable' : ''}
// 									key={name}>
// 									<span className="title">{name}</span>
// 									{microNotApplicable ? (
// 										<p id="microNotApplicable">{microNotApplicable.message}</p>
// 									) : (
// 										<>
// 											<span className="figure">
// 												<span className="value">
// 													<AnimatedTargetValue value={nodeValue} />
// 												</span>{' '}
// 												<Link
// 													title="Quel est calcul ?"
// 													style={{ color: this.props.colours.colour }}
// 													to={
// 														sitePaths.documentation.index +
// 														'/' +
// 														encodeRuleName(dottedName)
// 													}
// 													onClick={() => setSituationBranch(i)}
// 													className="explanation">
// 													{emoji('📖')}
// 												</Link>
// 											</span>
// 											<small>
// 												Soit{' '}
// 												{Math.round((1 - ratioPrélèvements.nodeValue) * 100)} %
// 												de{' '}
// 												<Link
// 													style={{ color: 'white' }}
// 													to={
// 														sitePaths.documentation.index +
// 														'/' +
// 														encodeRuleName(ratioPrélèvements.dottedName)
// 													}>
// 													prélèvements
// 												</Link>
// 											</small>
// 										</>
// 									)}
// 								</li>
// 							)
// 						})}
// 					</ul>
// 				</div>
// 			)
// 		}
// 	}
// )

const ComparativeTargets = () => (
	<div
		className="ui__ full-width"
		style={{
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'center',
			alignItems: 'stretch'
		}}>
		<Animate.fromBottom config={config.gentle}>
			<Indépendant />
			<AssimiléSalarié />
			<MicroEntreprise />
		</Animate.fromBottom>
	</div>
)

const Indépendant = connect(state => ({
	revenuDisponible: règleAvecMontantSelector(state, {
		situationBranchName: 'Indépendant'
	})('revenu disponible')
}))(({ revenuDisponible }) => (
	<SchemeCard
		title="Indépendants"
		subtitle="La protection à la carte"
		amount={revenuDisponible.montant}
		icon="👩‍🔧"
		features={[
			'Régime des indépendants',
			'Complémentaire santé et prévoyance facultatives',
			'Accidents du travail non couverts',
			'Retraite faible (41% du brut en moyenne)',
			'Indemnités journalières plus faibles',
			'Montant minimum de cotisations',
			'Comptabilité plus exigeante',
			'Calcul des cotisations décalé'
		]}
	/>
))

const AssimiléSalarié = connect(state => ({
	revenuDisponible: règleAvecMontantSelector(state, {
		situationBranchName: 'Assimilé salarié'
	})('revenu disponible')
}))(({ revenuDisponible }) => (
	<SchemeCard
		title="Assimilé salarié"
		subtitle="Le régime tout compris"
		amount={revenuDisponible.montant}
		icon="☂"
		features={[
			'Régime général',
			'Complémentaire santé et prévoyance incluse',
			'Accidents du travail couverts',
			'Retraite élevée (62 % du brut)',
			'Pas de minimum de paie',
			"Seuil pour l'activation des droits (4000€/an)",
			'Fiche de paie mensuels',
			'Prélèvement immédiat'
		]}
	/>
))

const MicroEntreprise = connect(state => ({
	revenuDisponible: règleAvecMontantSelector(state, {
		situationBranchName: 'Micro-entreprise'
	})('revenu disponible')
}))(({ revenuDisponible }) => (
	<SchemeCard
		title="Micro-entreprise"
		subtitle="Pour une petite activité"
		icon="🚶‍♂️"
		amount={revenuDisponible.montant}
		features={[
			'Régime des indépendants',
			'Pas de déduction des charges',
			'Pas de déduction fiscale pour la mutuelle (Madelin)',
			"Seuil de chiffre d'affaire",
			"Durée de l'ACCRE plus élevée",
			'Pas de CFE la première année',
			'Comptabilité simplifiée'
		]}
	/>
))

export default ComparativeTargets
