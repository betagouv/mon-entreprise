import { setSimulationConfig } from 'Actions/actions'
import { EndingCongratulations } from 'Components/conversation/Conversation'
import PeriodSwitch from 'Components/PeriodSwitch'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { decodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import CarbonImpact from './CarbonImpact'
import withTarget from './withTarget'

let CarbonImpactWithData = withTarget(CarbonImpact)

const Simulateur = (props) => {
	const objectif = props.match.params.name,
		decoded = decodeRuleName(objectif),
		rules = useSelector(flatRulesSelector),
		rule = findRuleByDottedName(rules, decoded),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
		},
		configSet = useSelector((state) => state.simulation?.config)
	useEffect(() => dispatch(setSimulationConfig(config)), [])

	if (!configSet) return null

	return (
		<div className="ui__ container" css="margin-bottom: 1em">
			<Helmet>
				<title>{rule.title}</title>
				{rule.description && (
					<meta name="description" content={rule.description} />
				)}
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
				targets={<>{rule.period === 'flexible' && <PeriodBlock />}</>}
			/>
			<CarbonImpactWithData />
			<ShareButton
				text="Mesure ton impact sur Futur.eco !"
				url={'https://' + window.location.hostname + props.match.url}
				title={rule.title}
			/>
		</div>
	)
}

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)

export default Simulateur
