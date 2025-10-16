import { useSSRSafeId } from '@react-aria/ssr'
import { RuleNode } from 'publicodes'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IStyledComponent, styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { FadeIn } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { H3, Intro, Markdown, SmallBody, Spacing } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { enregistreLaRéponse } from '@/store/actions/actions'
import {
	situationSelector,
	targetUnitSelector,
} from '@/store/selectors/simulationSelectors'
import { evaluateQuestion, getMeta } from '@/utils/publicodes'

type SubSectionProp = {
	dottedName: DottedName
	hideTitle?: boolean
	without?: DottedName[]
}

export function SubSection({
	dottedName: sectionDottedName,
	hideTitle = false,
	without = [],
}: SubSectionProp) {
	const engine = useEngine()
	const ruleTitle = engine.getRule(sectionDottedName)?.title
	const nextSteps = useNextQuestions()
	const situation = useSelector(situationSelector)

	if (engine.evaluate(sectionDottedName).nodeValue === null) {
		return null
	}
	const title = hideTitle ? null : ruleTitle
	const subQuestions = [
		...(Object.keys(situation) as Array<DottedName>),
		...nextSteps,
	].filter((nextStep) => {
		const {
			dottedName,
			rawNode: { question },
		} = engine.getRule(nextStep)

		return (
			!!question &&
			dottedName.startsWith(sectionDottedName) &&
			!without.some((dottedName) => nextStep.startsWith(dottedName))
		)
	})

	return (
		<>
			{!!subQuestions.length && title && <H3>{title}</H3>}
			{subQuestions.map((dottedName) => (
				<SimpleField key={dottedName} dottedName={dottedName} />
			))}
		</>
	)
}
type SimpleFieldProps = {
	dottedName: DottedName
	summary?: RuleNode['rawNode']['résumé']
	question?: RuleNode['rawNode']['question']
	showSuggestions?: boolean
	labelStyle?: IStyledComponent<'web', object>
}

export function SimpleField(props: SimpleFieldProps) {
	const {
		dottedName,
		question,
		summary,
		showSuggestions = false,
		labelStyle,
	} = props
	const dispatch = useDispatch()
	const engine = useEngine()
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const meta = getMeta<{ requis?: 'oui' | 'non' }>(rule.rawNode, {})
	const dispatchValue = useCallback(
		(value: ValeurPublicodes | undefined, dottedName: DottedName) => {
			dispatch(enregistreLaRéponse(dottedName, value))
		},
		[dispatch]
	)

	const labelId = useSSRSafeId()
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
			<StyledQuestion id={labelId}>
				<Markdown
					as="label"
					htmlFor={normalizeRuleName.Input(dottedName)}
					components={markdownComponents}
				>
					{displayedLabel}
				</Markdown>
				{required && <RedIntro aria-hidden>&nbsp;*</RedIntro>}
				<ExplicableRule dottedName={dottedName} />
			</StyledQuestion>
			{summary && <SmallBody>{summary ?? rule.rawNode.résumé}</SmallBody>}
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
				showSuggestions={showSuggestions}
			/>
			<Spacing sm />
		</FadeIn>
	)
}

const StyledQuestion = styled.div`
	display: inline-flex;
	align-items: baseline;
	margin-bottom: -0.75rem;
`
const RedIntro = styled(Intro)`
	color: ${({ theme }) =>
		theme.darkMode ? '' : theme.colors.extended.error[400]};
`
