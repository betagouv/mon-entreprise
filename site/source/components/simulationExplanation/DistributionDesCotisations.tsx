import { useSelector } from 'react-redux'

import BarChartBranch from '@/components/BarChart'
import RuleLink from '@/components/RuleLink'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

interface Props {
	regroupement: Partial<Record<DottedName, Array<string>>>
}

export const DistributionDesCotisations = ({ regroupement }: Props) => {
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useEngine()
	const distribution = (
		Object.entries(regroupement).map(([section, cotisations]) => [
			section,
			cotisations
				.map((c) => engine.evaluate({ valeur: c, unité: targetUnit }))
				.reduce(
					(acc, evaluation) => acc + ((evaluation?.nodeValue as number) || 0),
					0
				),
		]) as Array<[DottedName, number]>
	)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)

	const maximum = Math.max(...distribution.map(([, value]) => value))

	return (
		<>
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
		</>
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
	const branche = useEngine().getRule(dottedName)

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
