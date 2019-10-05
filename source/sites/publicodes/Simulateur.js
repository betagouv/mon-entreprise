import { React } from 'Components'
import { EndingCongratulations } from 'Components/conversation/Conversation'
import PeriodSwitch from 'Components/PeriodSwitch'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { Markdown } from 'Components/utils/markdown'
import { decodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import CarbonImpact from './CarbonImpact'
import ItemCard from './ItemCard'
import withTarget from './withTarget'

let CarbonImpactWithData = withTarget(CarbonImpact)

let ItemCardWithData = ItemCard(true)

export default connect(state => ({
	rules: flatRulesSelector(state),
	scenario: state.scenario
}))(props => {
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
				<Simulation
					noFeedback
					noProgressMessage
					showConversation
					customEnd={
						rule.description ? (
							<Markdown source={rule.description} />
						) : (
							<EndingCongratulations />
						)
					}
					targets={
						<>
							<ItemCardWithData />
							{rule.period === 'flexible' && <PeriodBlock />}
						</>
					}
				/>
				<CarbonImpactWithData />
				<ShareButton
					text="Mesure ton impact sur Futur.eco !"
					url={'https://' + window.location.hostname + props.match.url}
					title={rule.title}
				/>
			</div>
		))

	return <Simulateur />
})

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)
