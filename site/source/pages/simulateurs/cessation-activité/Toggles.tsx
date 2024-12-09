import { DottedName } from 'modele-social'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { DefaultValue } from '@/components/conversation/DefaultValue'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { useEngine } from '@/components/utils/EngineContext'
import { H3 } from '@/design-system/typography/heading'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { evaluateQuestion } from '@/utils/publicodes'

const Wrapper = styled.div`
	flex-shrink: 0;
	flex-basis: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

const CessationBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
`

export const CessationActivitéToggles = () => {
	const dispatch = useDispatch()
	const engine = useEngine()

	return (
		<Wrapper>
			<CessationBlock>
				<H3 id="questionHeader" as="h2">
					{evaluateQuestion(
						engine,
						engine.getRule('entreprise . date de cessation')
					)}
					<ExplicableRule light dottedName={'entreprise . date de cessation'} />
				</H3>
				<RuleInput
					dottedName="entreprise . date de cessation"
					onChange={(date) => {
						dispatch(
							ajusteLaSituation({
								'entreprise . date de cessation': date,
							} as Record<DottedName, SimpleRuleEvaluation>)
						)
					}}
					hideDefaultValue
				/>
				<DefaultValue dottedName={'entreprise . date de cessation'} />
			</CessationBlock>

			<RuleInput
				inputType="toggle"
				hideDefaultValue
				missing={false}
				dottedName="entreprise . imposition"
				onChange={(imposition) => {
					dispatch(
						ajusteLaSituation({
							'entreprise . imposition': imposition,
						} as Record<DottedName, SimpleRuleEvaluation>)
					)
				}}
			/>
		</Wrapper>
	)
}
