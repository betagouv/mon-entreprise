import * as R from 'effect/Record'
import { useSelector } from 'react-redux'

import RuleLink from '@/components/RuleLink'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

import { BarType } from './InnerStackedBarChart'
import StackedBarChart from './StackedBarChart'

type Props = {
	data: Record<BarType, { dottedName: DottedName; title: string }>
}

export default function StackedRulesChart({ data }: Props) {
	const engine = useEngine()
	const targetUnit = useSelector(targetUnitSelector)

	return (
		<StackedBarChart
			data={R.map(data, ({ dottedName, title }) => ({
				key: dottedName,
				value:
					(engine.evaluate({ valeur: dottedName, unité: targetUnit })
						.nodeValue as number) || 0,
				legend: (
					<RuleLink dottedName={dottedName} aria-label={title}>
						{title}
					</RuleLink>
				),
				title,
			}))}
		/>
	)
}
