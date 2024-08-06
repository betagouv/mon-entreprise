import { DottedName } from 'modele-social'
import { useDispatch } from 'react-redux'

import { DefaultValue } from '@/components/conversation/DefaultValue'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { useEngine } from '@/components/utils/EngineContext'
import { H3 } from '@/design-system/typography/heading'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'
import { evaluateQuestion } from '@/utils/publicodes'

export const CessationActivitéToggles = () => {
	const dispatch = useDispatch()
	const engine = useEngine()

	return (
		<div
			style={{
				flexShrink: 0,
				flexBasis: '100%',

				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'start',
				}}
			>
				<H3 id="questionHeader" as="h2">
					{evaluateQuestion(
						engine,
						engine.getRule('entreprise . date de radiation')
					)}
					<ExplicableRule light dottedName={'entreprise . date de radiation'} />
				</H3>
				<RuleInput
					dottedName="entreprise . date de radiation"
					onChange={(date) => {
						dispatch(
							ajusteLaSituation({
								'entreprise . date de radiation': date,
							} as Record<DottedName, SimpleRuleEvaluation>)
						)
					}}
				/>
				<DefaultValue dottedName={'entreprise . date de radiation'} />
			</div>

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
		</div>
	)
}
