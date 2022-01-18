import { goToQuestion, resetSimulation } from 'Actions/actions'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { Button } from 'DesignSystem/buttons'
import { H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import './AnswerList.css'

type AnswerListProps = {
	onClose: () => void
}

const Header = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

const Title = styled(H2)`
	flex-grow: 1;
`

export default function AnswerList({ onClose }: AnswerListProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const passedQuestions = useSelector(answeredQuestionsSelector)
	const answeredAndPassedQuestions = useMemo(
		() =>
			(Object.keys(situation) as DottedName[])
				.filter(
					(answered) => !passedQuestions.some((passed) => answered === passed)
				)
				.concat(passedQuestions)
				.map((dottedName) => engine.evaluate(engine.getRule(dottedName))),
		[engine, passedQuestions, situation]
	)

	const nextSteps = useNextQuestions().map((dottedName) =>
		engine.evaluate(engine.getRule(dottedName))
	)

	return (
		<div className="answer-list">
			{!!answeredAndPassedQuestions.length && (
				<>
					<Header>
						<Title>
							<Emoji emoji="📋 " />
							<Trans>Mes réponses</Trans>
						</Title>
						<Button
							size="XS"
							light
							onPress={() => {
								dispatch(resetSimulation())
								onClose()
							}}
						>
							<Emoji emoji="🗑" /> <Trans>Tout effacer</Trans>
						</Button>
					</Header>
					<StepsTable {...{ rules: answeredAndPassedQuestions, onClose }} />
				</>
			)}
			{!!nextSteps.length && (
				<>
					<H2>
						<Emoji emoji="🔮 " />
						<Trans>Prochaines questions</Trans>
					</H2>
					<StepsTable {...{ rules: nextSteps, onClose }} />
				</>
			)}
		</div>
	)
}

const TBody = styled.tbody`
	font-family: ${({ theme }) => theme.fonts.main};
	& > tr > td {
		padding: 0.5rem 0.75rem;
	}
	& > tr:nth-child(2n) {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}
`

function StepsTable({
	rules,
	onClose,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
	onClose: () => void
}) {
	const dispatch = useDispatch()
	const language = useTranslation().i18n.language
	return (
		<table>
			<TBody>
				{rules.map((rule) => (
					<tr key={rule.dottedName}>
						<td>
							<Link
								onPress={() => {
									dispatch(goToQuestion(rule.dottedName))
									onClose()
								}}
							>
								{rule.title}
							</Link>
						</td>
						<td>
							<span className="">{formatValue(rule, { language })}</span>
						</td>
					</tr>
				))}
			</TBody>
		</table>
	)
}
