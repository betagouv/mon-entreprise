import React from 'react'
import { useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import répartitionSelector from 'Selectors/repartitionSelectors'
import './Distribution.css'
import './PaySlip'
import RuleLink from './RuleLink'
import BarChartBranch from './BarChart'

export default function Distribution() {
	const distribution = useSelector(répartitionSelector) as any

	if (!Object.values(distribution).length) {
		return null
	}

	return (
		<>
			<div className="distribution-chart__container">
				{distribution.répartition.map(
					([brancheDottedName, { partPatronale, partSalariale }]) => (
						<DistributionBranch
							key={brancheDottedName}
							dottedName={brancheDottedName}
							value={partPatronale + partSalariale}
							maximum={distribution.maximum}
						/>
					)
				)}
			</div>
		</>
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
	const rules = useSelector(parsedRulesSelector)
	const branch = rules[dottedName]
	return (
		<BarChartBranch
			value={value}
			maximum={maximum}
			title={<RuleLink {...branch} />}
			icon={icon ?? branch.icons}
			description={branch.summary}
			unit="€"
		/>
	)
}
