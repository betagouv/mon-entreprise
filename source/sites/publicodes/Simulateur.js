import Simulation from 'Components/Simulation'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { React, emoji } from 'Components'
import { Helmet } from 'react-helmet'
import ImpactCard from './ImpactCard'
import { decodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import PeriodSwitch from 'Components/PeriodSwitch'
import ShareButton from 'Components/ShareButton'

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	props => {
		let objectif = props.match.params.name,
			decoded = decodeRuleName(objectif),
			rule = findRuleByDottedName(props.rules, decoded),
			Simulateur = withSimulationConfig({
				objectifs: [decoded]
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
						noFeedback
						noProgressMessage
						showConversation
						targets={
							<>
								<ImpactCard />
								{rule.period === 'flexible' && <PeriodBlock />}
							</>
						}
					/>
					<ShareButton
						text="Mesure ton impact sur Futur.eco !"
						url={'https://' + window.location.hostname + props.match.url}
						title={rule.title}
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
