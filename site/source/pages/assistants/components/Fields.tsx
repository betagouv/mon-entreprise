import { useSSRSafeId } from '@react-aria/ssr'
import { DottedName } from 'modele-social'
import { PublicodesExpression, RuleNode } from 'publicodes'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IStyledComponent, styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { FadeIn } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
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
	label?: string
	['aria-label']?: string
	labelStyle?: IStyledComponent<'web', object>
	required?: boolean
}

export function SimpleField(props: SimpleFieldProps) {
	const {
		dottedName,
		question,
		summary,
		showSuggestions = false,
		label,
		labelStyle,
		required,
	} = props
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const engine = useEngine()
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const meta = getMeta<{ requis?: 'oui' | 'non' }>(rule.rawNode, {})
	const dispatchValue = useCallback(
		(value: PublicodesExpression | undefined, dottedName: DottedName) => {
			dispatch(enregistreLaRéponse(dottedName, value))
		},
		[dispatch]
	)

	const labelId = useSSRSafeId()
	const targetUnit = useSelector(targetUnitSelector)

	if (evaluation.nodeValue === null) {
		return null
	}
	let displayedLabel = label
	if (!displayedLabel) {
		displayedLabel =
			question ?? evaluateQuestion(engine, engine.getRule(dottedName))
	}
	if (!displayedLabel) {
		displayedLabel =
			rule.title + (rule.rawNode.résumé ? ` – ${rule.rawNode.résumé}` : '')
	}

	if (meta.requis === 'oui') {
		if (displayedLabel) {
			displayedLabel += ' *'
		}
	}

	const markdownComponents = {
		p: labelStyle ?? Intro,
	}

	return (
		<FadeIn>
			<StyledQuestion id={labelId}>
				<Markdown components={markdownComponents}>{displayedLabel}</Markdown>
				{required && (
					<div>
						<span aria-hidden>&nbsp;*</span>
						<span className="sr-only">&nbsp;({t('champ obligatoire')})</span>
					</div>
				)}
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
				required={meta.requis === 'oui'}
				missing={
					evaluation.nodeValue === undefined ||
					Object.keys(evaluation.missingVariables).length > 0
				}
				onChange={dispatchValue}
				showSuggestions={showSuggestions}
				aria-label={props?.['aria-label']}
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
