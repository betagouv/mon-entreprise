import { useTranslation } from 'react-i18next'

import StackedRulesChart from '@/components/simulationExplanation/StackedRulesChart/StackedRulesChart'
import { Emoji, H2, Link } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { BarType } from '../StackedRulesChart/InnerStackedBarChart'

type Props = {
	onSeePayslip: () => void
	data: Record<BarType, { dottedName: DottedName; title: string }>
}

export default function RevenueRepartitionSection({
	onSeePayslip,
	data,
}: Props) {
	const { t } = useTranslation()

	return (
		<section>
			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
				}}
			>
				<H2
					style={{
						flex: '1',
					}}
				>
					{t('payslip.repartition', 'Répartition du total chargé')}
				</H2>
				<Link onPress={onSeePayslip}>
					<Emoji emoji="📊" /> {t('payslip.link', 'Voir la fiche de paie')}
				</Link>
			</div>
			<StackedRulesChart data={data} />
		</section>
	)
}
