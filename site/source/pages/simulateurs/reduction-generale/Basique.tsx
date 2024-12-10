import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal } from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'

import Répartition from './components/Répartition'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import {
	réductionGénéraleDottedName,
	rémunérationBruteDottedName,
} from './utils'

type Props = {
	onUpdate: () => void
}

export default function RéductionGénéraleBasique({ onUpdate }: Props) {
	const { t } = useTranslation()

	return (
		<>
			<SimulationGoal
				dottedName={rémunérationBruteDottedName}
				round={false}
				label={t('Rémunération brute')}
				onUpdateSituation={onUpdate}
			/>

			<Warnings />
			<Condition expression={`${rémunérationBruteDottedName} > 1.6 * SMIC`}>
				<Message type="info">
					<Body>
						<WarningSalaireTrans />
					</Body>
				</Message>
			</Condition>

			<Condition expression={`${réductionGénéraleDottedName} >= 0`}>
				<SimulationValue
					dottedName={réductionGénéraleDottedName}
					isInfoMode={true}
					round={false}
				/>
				<Spacing md />
				<Répartition />
			</Condition>
		</>
	)
}
