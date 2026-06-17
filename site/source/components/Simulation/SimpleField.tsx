import { useCallback, useId } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IStyledComponent, styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { FadeIn } from '@/components/ui/animate'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { Intro, Markdown } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { evaluateQuestion, getMeta } from '@/utils/publicodes/publicodes'

type SimpleFieldProps = {
	dottedName: DottedName
	question?: string
	labelStyle?: IStyledComponent<'web', object>
	errorMessage?: string
}

export function SimpleField(props: SimpleFieldProps) {
	const { dottedName, question, labelStyle, errorMessage } = props
	const dispatch = useDispatch()
	const engine = useEngine()
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const meta = getMeta<{ requis?: 'oui' | 'non' }>(rule.rawNode, {})
	const dispatchValue = useCallback(
		(value: ValeurPublicodes | undefined, dottedName: DottedName) => {
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
		},
		[dispatch]
	)

	const labelId = useId()
	const targetUnit = useSelector(targetUnitSelector)

	if (evaluation.nodeValue === null) {
		return null
	}

	let displayedLabel =
		question ?? evaluateQuestion(engine, engine.getRule(dottedName))

	if (!displayedLabel) {
		displayedLabel =
			rule.title + (rule.rawNode.résumé ? ` – ${rule.rawNode.résumé}` : '')
	}

	const markdownComponents = {
		p: labelStyle ?? Intro,
	}

	const required = meta.requis === 'oui'

	return (
		<FadeIn>
			<div>
				<Markdown
					as="label"
					id={labelId}
					htmlFor={normalizeRuleName.Input(dottedName)}
					components={markdownComponents}
				>
					{displayedLabel}
				</Markdown>
				{required && <RedIntro aria-hidden>&nbsp;*</RedIntro>}
				<ExplicableRule dottedName={dottedName} />
			</div>
			<RuleInput
				dottedName={dottedName}
				displayedUnit={
					evaluation.unit?.numerators.includes(targetUnit)
						? targetUnit
						: undefined
				}
				aria-labelledby={labelId}
				required={required}
				missing={
					evaluation.nodeValue === undefined ||
					Object.keys(evaluation.missingVariables).length > 0
				}
				onChange={dispatchValue}
				showSuggestions={false}
				errorMessage={errorMessage}
			/>
		</FadeIn>
	)
}

const RedIntro = styled(Intro)`
	color: ${({ theme }) =>
		theme.darkMode ? '' : theme.colors.extended.error[400]};
`
