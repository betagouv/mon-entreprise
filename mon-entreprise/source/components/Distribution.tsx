import { EngineContext } from 'Components/utils/EngineContext'
import { max } from 'ramda'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import BarChartBranch from './BarChart'
import './Distribution.css'
import './PaySlip'
import { getCotisationsBySection } from './PaySlip'
import RuleLink from './RuleLink'

export default function Distribution() {
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const distribution = (getCotisationsBySection(
		useContext(EngineContext).getParsedRules()
	).map(([section, cotisations]) => [
		section,
		cotisations
			.map(c => engine.evaluate(c, { unit: targetUnit }))
			.reduce(
				(acc, evaluation) => acc + ((evaluation?.nodeValue as number) || 0),
				0
			)
	]) as Array<[DottedName, number]>)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)

	const maximum = distribution.map(([, value]) => value).reduce(max, 0)

	return (
		<div className="distribution-chart__container">
			{distribution.map(([sectionName, value]) => (
				<DistributionBranch
					key={sectionName}
					dottedName={sectionName}
					value={value}
					maximum={maximum}
				/>
			))}
		</div>
	)
}

type DistributionBranchProps = {
	dottedName: DottedName
	value: number
	maximum: number

	icon?: string
}

export function DistributionBranch({
	dottedName,
	value,
	icon,
	maximum
}: DistributionBranchProps) {
	const rules = useContext(EngineContext).getParsedRules()
	const branche = rules[dottedName]

	return (
		<BarChartBranch
			value={value}
			maximum={maximum}
			title={<RuleLink dottedName={dottedName} />}
			icon={icon ?? branche.icons}
			description={branche.summary}
			unit="€"
		/>
	)
}
