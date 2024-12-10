import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal } from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

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
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const { t } = useTranslation()

	const répartition = {
		IRC:
			(engine.evaluate({
				valeur: `${réductionGénéraleDottedName} . imputation retraite complémentaire`,
				unité: currentUnit,
			})?.nodeValue as number) ?? 0,
		Urssaf:
			(engine.evaluate({
				valeur: `${réductionGénéraleDottedName} . imputation sécurité sociale`,
				unité: currentUnit,
			})?.nodeValue as number) ?? 0,
		chômage:
			(engine.evaluate({
				valeur: `${réductionGénéraleDottedName} . imputation chômage`,
				unité: currentUnit,
			})?.nodeValue as number) ?? 0,
	}

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
				<Répartition répartition={répartition} />
			</Condition>
		</>
	)
}
