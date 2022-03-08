import { updateSituation } from '@/actions/actions'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { FromTop } from '@/components/ui/animate'
import { EngineContext } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { H3 } from '@/design-system/typography/heading'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useCallback, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from '@/selectors/simulationSelectors'
import { Question } from './PreviousVersion'

type SubSectionProp = {
	dottedName: DottedName
	hideTitle?: boolean
}
export function SubSection({
	dottedName: sectionDottedName,
	hideTitle = false,
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
		return !!question && dottedName.startsWith(sectionDottedName)
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
}
export function SimpleField({
	dottedName,
	question,
	summary,
	showSuggestions,
}: SimpleFieldProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)

	const dispatchValue = useCallback(
		(value, dottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)

	if (evaluation.nodeValue === null) {
		return null
	}
	return (
		<div>
			<FromTop>
				<Question>
					<Intro>
						{question ?? rule.rawNode.question}&nbsp;
						<ExplicableRule dottedName={dottedName} />
					</Intro>
					<SmallBody>{summary ?? rule.rawNode.résumé}</SmallBody>

					<RuleInput
						dottedName={dottedName}
						onChange={dispatchValue}
						showSuggestions={showSuggestions}
					/>
				</Question>
			</FromTop>
		</div>
	)
}
