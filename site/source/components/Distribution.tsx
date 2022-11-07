import { EngineContext, useEngine } from '@/components/utils/EngineContext'
import { DottedName } from 'modele-social'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from '@/selectors/simulationSelectors'
import BarChartBranch from './BarChart'
import './Distribution.css'
import { getCotisationsBySection } from './PaySlip'
import RuleLink from './RuleLink'

export default function Distribution() {
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const distribution = (
		getCotisationsBySection(useEngine().getParsedRules()).map(
			([section, cotisations]) => [
				section,
				cotisations
					.map((c) => engine.evaluate({ valeur: c, unité: targetUnit }))
					.reduce(
						(acc, evaluation) => acc + ((evaluation?.nodeValue as number) || 0),
						0
					),
			]
		) as Array<[DottedName, number]>
	)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)

	const maximum = Math.max(...distribution.map(([, value]) => value))

	return (
		<div className="distribution-chart__container" role="list">
			{distribution.map(([sectionName, value]) => (
				<DistributionBranch
					key={sectionName}
					dottedName={sectionName}
					value={value}
					maximum={maximum}
					role="listitem"
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
	role?: string
}

export function DistributionBranch({
	dottedName,
	value,
	icon,
	maximum,
	...props
}: DistributionBranchProps) {
	const branche = useContext(EngineContext).getRule(dottedName)

	return (
		<BarChartBranch
			value={value}
			maximum={maximum}
			title={<RuleLink dottedName={dottedName} />}
			icon={icon ?? branche.rawNode.icônes}
			description={branche.rawNode.résumé}
			unit="€"
			{...props}
		/>
	)
}
