import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation().i18n
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
					<RuleLink
						dottedName={dottedName}
						aria-label={t(
							'composants.engine-value.voir-les-details-du-calcul',
							'Voir les détails du calcul de {{title}}',
							{ title }
						)}
					>
						{title}
					</RuleLink>
				),
				title,
			}))}
		/>
	)
}
