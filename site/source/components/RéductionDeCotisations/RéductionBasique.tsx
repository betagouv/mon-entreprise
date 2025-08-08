import { PublicodesExpression } from 'publicodes'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import Répartition from '@/components/RéductionDeCotisations/Répartition'
import { SimulationGoal } from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { useEngine } from '@/components/utils/EngineContext'
import { Intro, Message, Spacing } from '@/design-system'
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

	const répartition =
		withRépartition && getRépartitionBasique(dottedName, currentUnit, engine)

	return (
		<>
			<SimulationGoal
				dottedName={rémunérationBruteDottedName}
				round={false}
				label={t('Rémunération brute')}
				onUpdateSituation={onUpdate}
			/>

			{warnings}
			<ReductionBasiqueConditionWrapper>
				<Condition expression={warningCondition}>
					<Message type="info">
						<Intro>{warningMessage}</Intro>
					</Message>
				</Condition>
			</ReductionBasiqueConditionWrapper>

			<ReductionBasiqueConditionWrapper>
				<Condition expression={`${dottedName} >= 0`}>
					<SimulationValue
						dottedName={dottedName}
						isInfoMode={true}
						round={false}
					/>
					<Spacing md />
					{répartition && (
						<Répartition dottedName={dottedName} répartition={répartition} />
					)}
				</Condition>
			</ReductionBasiqueConditionWrapper>
		</>
	)
}

const ReductionBasiqueConditionWrapper = styled.div`
	a {
		font-size: ${({ theme }) => theme.fontSizes.lg};
	}
`
