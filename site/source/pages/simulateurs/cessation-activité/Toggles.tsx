import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { DefaultValue } from '@/components/conversation/DefaultValue'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { H3 } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { ajusteLaSituation } from '@/store/actions/actions'
import { evaluateQuestion } from '@/utils/publicodes/publicodes'

export const CessationActivitéToggles = () => {
	const dispatch = useDispatch()
	const engine = useEngine()

	return (
		<>
			<CessationBlock>
				<CessationQuestion as="h2">
					{evaluateQuestion(
						engine,
						engine.getRule('entreprise . date de cessation')
					)}
					<ExplicableRule light dottedName={'entreprise . date de cessation'} />
				</CessationQuestion>
				<CessationDateWrapper>
					<RuleInput
						dottedName="entreprise . date de cessation"
						onChange={(date) => {
							dispatch(
								ajusteLaSituation({
									'entreprise . date de cessation': date,
								} as Record<DottedName, ValeurPublicodes | undefined>)
							)
						}}
						hideDefaultValue
					/>
				</CessationDateWrapper>
				<DefaultValue dottedName={'entreprise . date de cessation'} />
			</CessationBlock>

			<ImpositionBlock>
				<RuleInput
					inputType="toggle"
					hideDefaultValue
					missing={false}
					dottedName="entreprise . imposition"
					onChange={(imposition) => {
						dispatch(
							ajusteLaSituation({
								'entreprise . imposition': imposition,
							} as Record<DottedName, ValeurPublicodes | undefined>)
						)
					}}
				/>
			</ImpositionBlock>
		</>
	)
}

const CessationBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
	flex-wrap: wrap;
	margin-bottom: -1rem;
	margin-top: -3rem;
	width: 100%;
`
const CessationQuestion = styled(H3)`
	overflow-wrap: break-word;
	text-align: left;
`
const CessationDateWrapper = styled.div`
	margin-top: -1.5rem;
	margin-bottom: -1.5rem;
`

const ImpositionBlock = styled.div`
	margin-bottom: 0.5rem;
`
