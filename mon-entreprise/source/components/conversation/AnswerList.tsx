import { goToQuestion, resetSimulation } from 'Actions/actions'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import Popover from 'DesignSystem/Popover'
import { H2 } from 'DesignSystem/typography/heading'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import './AnswerList.css'

type AnswerListProps = {
	onClose: () => void
}

export default function AnswerList({ onClose }: AnswerListProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const answeredQuestions = (
		Object.keys(useSelector(situationSelector)) as Array<DottedName>
	).map((dottedName) => engine.evaluate(engine.getRule(dottedName)))

	const nextSteps = useNextQuestions().map((dottedName) =>
		engine.evaluate(engine.getRule(dottedName))
	)

	return (
		<Popover onClose={onClose} isDismissable>
			<div className="answer-list">
				{!!answeredQuestions.length && (
					<>
						<H2>
							<Emoji emoji="📋 " />
							<Trans>Mes réponses</Trans>
							<small css="margin-left: 2em; img {font-size: .8em}">
								<Emoji emoji="🗑" />{' '}
								<button
									className="ui__ simple small button"
									onClick={() => {
										dispatch(resetSimulation())
										onClose()
									}}
								>
									<Trans>Tout effacer</Trans>
								</button>
							</small>
						</H2>
						<StepsTable {...{ rules: answeredQuestions, onClose }} />
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
		</Popover>
	)
}

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
			<tbody>
				{rules.map((rule) => (
					<tr
						key={rule.dottedName}
						css={`
							background: var(--lightestColor);
						`}
					>
						<td>
							<button
								className="ui__ link-button"
								onClick={() => {
									dispatch(goToQuestion(rule.dottedName))
									onClose()
								}}
							>
								{rule.title}
							</button>
						</td>
						<td>
							<span
								css={`
									display: inline-block;
									padding: 0.2rem;
									color: inherit;
									font-size: inherit;
									width: 100%;
									text-align: start;
									font-weight: 600;
									> span {
										border-bottom-color: var(--textColorOnWhite);
										padding: 0.05em 0em;
										display: inline-block;
									}
								`}
							>
								<span className="answerContent">
									{formatValue(rule, { language })}
								</span>
							</span>{' '}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
