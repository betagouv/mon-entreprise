import Simulation from 'Components/Simulation'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { React, emoji } from 'Components'
import { Helmet } from 'react-helmet'
import ImpactCard from './ImpactCard'
import { findRuleByDottedName } from 'Engine/rules'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import PeriodSwitch from 'Components/PeriodSwitch'

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	props => {
		let objectif = props.match.params.name,
			rule = findRuleByDottedName(props.rules, objectif),
			Simulateur = withSimulationConfig({
				objectifs: [objectif]
			})(() => (
				<div className="ui__ container">
					<Helmet>
						<title>{rule.title}</title>
						<meta name="description" content="DESCRIPTION" />
					</Helmet>
					<h1>
						{rule.icônes && emoji(rule.icônes + ' ')}
						{rule.title}
					</h1>
					<Simulation
						showTargetsAnyway
						targetsTriggerConversation={false}
						targets={
							<>
								<ImpactCard />
								{rule.period === 'flexible' && <PeriodBlock />}
							</>
						}
						explanation={<p>PTITE EXPLICATION DU RESULTAT</p>}
					/>
				</div>
			))

		return <Simulateur />
	}
)

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)
