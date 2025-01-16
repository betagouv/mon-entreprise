import { PublicodesExpression } from 'publicodes'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import Répartition from '@/components/RéductionDeCotisations/Répartition'
import { SimulationGoal } from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'
import {
	getRépartitionBasique,
	RéductionDottedName,
	rémunérationBruteDottedName,
} from '@/utils/réductionDeCotisations'

type Props = {
	dottedName: RéductionDottedName
	onUpdate: () => void
	warningCondition: PublicodesExpression
	warningMessage: ReactNode
	warnings?: ReactNode
	withRépartition?: boolean
}

export default function RéductionBasique({
	dottedName,
	onUpdate,
	warningCondition,
	warningMessage,
	warnings,
	withRépartition = true,
}: Props) {
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const { t } = useTranslation()

	const répartition = getRépartitionBasique(dottedName, currentUnit, engine)

	return (
		<>
			<SimulationGoal
				dottedName={rémunérationBruteDottedName}
				round={false}
				label={t('Rémunération brute')}
				onUpdateSituation={onUpdate}
			/>

			{warnings}

			<Condition expression={warningCondition}>
				<Message type="info">
					<Body>{warningMessage}</Body>
				</Message>
			</Condition>

			<Condition expression={`${dottedName} >= 0`}>
				<SimulationValue
					dottedName={dottedName}
					isInfoMode={true}
					round={false}
				/>
				<Spacing md />
				{withRépartition && (
					<Répartition dottedName={dottedName} répartition={répartition} />
				)}
			</Condition>
		</>
	)
}
