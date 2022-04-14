import { updateSituation } from '@/actions/actions'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { FadeIn } from '@/components/ui/animate'
import { EngineContext } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
import {
	situationSelector,
	targetUnitSelector,
} from '@/selectors/simulationSelectors'
import { evaluateQuestion, getMeta } from '@/utils'
import { useSSRSafeId } from '@react-aria/ssr'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

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
	const engine = useContext(EngineContext)
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
}

export function SimpleField({
	dottedName,
	question,
	summary,
	showSuggestions = false,
	label,
}: SimpleFieldProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const meta = getMeta<{ requis?: 'oui' | 'non' }>(rule.rawNode, {})

	const dispatchValue = useCallback(
		(value, dottedName: DottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)

	const displayedQuestion =
		question ?? evaluateQuestion(engine, engine.getRule(dottedName))

	const labelId = useSSRSafeId()
	const targetUnit = useSelector(targetUnitSelector)

	if (evaluation.nodeValue === null) {
		return null
	}

	return (
		<FadeIn>
			<StyledQuestion id={labelId}>
				{displayedQuestion && (
					<Markdown components={{ p: Intro }}>{displayedQuestion}</Markdown>
				)}
				<ExplicableRule dottedName={dottedName} />
			</StyledQuestion>
			{summary && <SmallBody>{summary ?? rule.rawNode.résumé}</SmallBody>}
			<RuleInput
				dottedName={dottedName}
				displayedUnit={targetUnit}
				aria-labelledby={displayedQuestion ? labelId : undefined}
				label={
					label ??
					(!displayedQuestion
						? rule.title +
						  (rule.rawNode.résumé ? ` – ${rule.rawNode.résumé}` : '') +
						  (meta.requis === 'oui' ? `*` : '')
						: undefined)
				}
				required={meta.requis === 'oui'}
				onChange={dispatchValue}
				showSuggestions={showSuggestions}
			/>
			<Spacing md />
		</FadeIn>
	)
}

const StyledQuestion = styled.div`
	display: inline-flex;
	align-items: baseline;
	margin-bottom: -0.75rem;
`
