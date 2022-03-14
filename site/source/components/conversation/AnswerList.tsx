import { resetSimulation, stepAction, updateSituation } from '@/actions/actions'
import { resetCompany } from '@/actions/companyActions'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import {
	answeredQuestionsSelector,
	companySituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { Grid } from '@mui/material'
import { DottedName } from 'modele-social'
import { EvaluatedNode } from 'publicodes'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Value from '../EngineValue'
import RuleInput from './RuleInput'

type AnswerListProps = {
	onClose: () => void
}

export default function AnswerList({ onClose }: AnswerListProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const companySituation = useSelector(companySituationSelector)
	const passedQuestions = useSelector(answeredQuestionsSelector)
	const answeredAndPassedQuestions = useMemo(
		() =>
			(Object.keys(situation) as DottedName[])
				.filter(
					(answered) => !passedQuestions.some((passed) => answered === passed)
				)
				.concat(passedQuestions)
				.filter((answered) => !(answered in companySituation))
				.map((dottedName) => engine.evaluate(engine.getRule(dottedName))),
		[engine, passedQuestions, situation, companySituation]
	)
	const nextSteps = useNextQuestions().map((dottedName) =>
		engine.evaluate(engine.getRule(dottedName))
	)
	const companyQuestions = useMemo(
		() =>
			(Object.keys(companySituation) as DottedName[])
				.map((dottedName) => engine.evaluate(engine.getRule(dottedName)))
				.sort((a, b) => (a.title < b.title ? -1 : 1)),
		[engine, companySituation]
	)

	return (
		<div className="answer-list">
			<H2>
				<Emoji emoji="📋 " />
				<Trans>Ma situation</Trans>
			</H2>

			{!!answeredAndPassedQuestions.length && (
				<>
					<H3>
						<Trans>Simulation en cours</Trans>
					</H3>

					<StepsTable {...{ rules: answeredAndPassedQuestions, onClose }} />
					<Spacing sm />
					<div
						css={`
							text-align: center;
						`}
					>
						<Button
							size="XS"
							onPress={() => {
								dispatch(resetSimulation())
							}}
						>
							<Emoji emoji="🗑" /> <Trans>Recommencer la simulation</Trans>
						</Button>
					</div>
				</>
			)}

			{companyQuestions.length > 0 && (
				<>
					<H3>
						<Trans>Mon entreprise</Trans>
					</H3>
					<StepsTable {...{ rules: companyQuestions, onClose }} />
					<Spacing sm />
					<div
						css={`
							text-align: center;
						`}
					>
						<Button
							light
							size="XS"
							onClick={() => {
								dispatch(resetSimulation())
								dispatch(resetCompany())
							}}
						>
							<Emoji emoji="🗑" /> <Trans>Supprimer toute ma situation</Trans>
						</Button>
					</div>
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

function StepsTable({
	rules,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
	onClose: () => void
}) {
	return (
		<>
			{rules
				.filter((rule) => rule.nodeValue !== null)
				.map((rule) => (
					<StyledAnswerList
						container
						alignItems={'baseline'}
						justifyContent="flex-end"
						key={rule.dottedName}
						gap={2}
					>
						<Grid item xs>
							{rule.title}
						</Grid>
						<StyledAnswer item xs="auto">
							<AnswerElement {...rule} />
						</StyledAnswer>
					</StyledAnswerList>
				))}
		</>
	)
}

function AnswerElement(
	rule: EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }
) {
	const [isEditing, setEditing] = useState(false)

	const dispatch = useDispatch()
	const ruleInputRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const onClickOutside = (click: MouseEvent) => {
			if (!ruleInputRef.current) {
				return
			}
			if (
				click.target instanceof HTMLElement &&
				ruleInputRef.current.contains(click.target)
			) {
				return
			}
			setEditing(false)
		}
		window.addEventListener('click', onClickOutside)
		return () => window.removeEventListener('click', onClickOutside)
	}, [])
	const situation = useSelector(situationSelector)
	const handleChange = useCallback(
		(value) => {
			dispatch(updateSituation(rule.dottedName, value))

			if (!(rule.dottedName in situation)) {
				dispatch(stepAction(rule.dottedName))
			}
		},
		[dispatch, rule.dottedName, situation]
	)
	const handleSubmit = useCallback(() => {
		setEditing(false)
	}, [])

	return rule.rawNode.question ? (
		isEditing ? (
			<div ref={ruleInputRef}>
				<form onSubmit={handleSubmit}>
					<RuleInput
						dottedName={rule.dottedName}
						onChange={handleChange}
						autoFocus
						onBlur={handleSubmit}
						onSubmit={handleSubmit}
					/>
				</form>
			</div>
		) : (
			<Link onPress={() => setEditing(true)} title="Modifier">
				<Value expression={rule.dottedName} linkToRule={false} />{' '}
				<Emoji emoji="✏" alt="Modifier" />
			</Link>
		)
	) : (
		<Value expression={rule.dottedName} linkToRule={false} />
	)
}

const StyledAnswer = styled(Grid)`
	text-align: right;
`
const StyledAnswerList = styled(Grid)`
	padding: ${({ theme }) => theme.spacings.xs};
	margin: 0 -${({ theme }) => theme.spacings.xs};
	font-family: ${({ theme }) => theme.fonts.main};
	:nth-child(2n) {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}
`
