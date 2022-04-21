import { resetSimulation, updateSituation } from '@/actions/actions'
import { resetCompany } from '@/actions/companyActions'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { Message, PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import {
	answeredQuestionsSelector,
	companySituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { evaluateQuestion } from '@/utils'
import { Grid } from '@mui/material'
import { DottedName } from 'modele-social'
import { EvaluatedNode } from 'publicodes'
import { useCallback, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Value from '../EngineValue'
import { ExplicableRule } from './Explicable'
import RuleInput from './RuleInput'

type AnswerListProps = {
	onClose: () => void
	children?: React.ReactNode
}

export default function AnswerList({ onClose, children }: AnswerListProps) {
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
				.filter(
					(dottedName) =>
						engine.getRule(dottedName).rawNode.question !== undefined
				)
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
					<Grid container alignItems={'baseline'}>
						<Grid item xs>
							<H3>
								<Trans>Simulation en cours</Trans>
							</H3>
						</Grid>
						<Grid item>
							<div
								className="print-hidden"
								css={`
									text-align: right;
								`}
							>
								<Button
									size="XS"
									light
									onPress={() => {
										dispatch(resetSimulation())
									}}
								>
									<Emoji emoji="🗑" /> <Trans>Effacer mes réponses</Trans>
								</Button>
							</div>
						</Grid>
					</Grid>

					<StepsTable {...{ rules: answeredAndPassedQuestions, onClose }} />
					{children}
				</>
			)}
			{companyQuestions.length > 0 && (
				<>
					<Spacing md />

					<H3>
						<Trans>Mon entreprise</Trans>
					</H3>

					<StepsTable {...{ rules: companyQuestions, onClose }} />
					<Spacing md />
					{/* <Grid container item lg={12} justifyContent="center"> */}
					<Message type="info" border={false}>
						<Body>
							Les réponses liées à l'entreprise sont automatiquement
							sauvegardées d'une simulation à l'autre.{' '}
							<Link
								onPress={() => {
									dispatch(resetSimulation())
									dispatch(resetCompany())
								}}
							>
								<Trans>Supprimer les données sauvegardées.</Trans>{' '}
							</Link>
						</Body>
					</Message>
					{/* </Grid> */}
				</>
			)}

			{!!nextSteps.length && (
				<div className="print-hidden">
					<H2>
						<Emoji emoji="🔮 " />
						<Trans>Prochaines questions</Trans>
					</H2>
					<StepsTable {...{ rules: nextSteps, onClose }} />
				</div>
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
							<ExplicableRule light dottedName={rule.dottedName} />
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
	const dispatch = useDispatch()

	const dottedName = rule.dottedName
	const handleChange = useCallback(
		(value) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch, dottedName]
	)
	const engine = useEngine()

	return rule.rawNode.question ? (
		<PopoverWithTrigger
			small
			trigger={(buttonProps) => (
				<Link {...buttonProps} title="Modifier">
					<Value expression={rule.dottedName} linkToRule={false} />{' '}
					<span className="print-hidden">
						<Emoji emoji="✏" alt="Modifier" />
					</span>
				</Link>
			)}
		>
			{(onClose) => (
				<>
					<form onSubmit={onClose}>
						<H3>
							{evaluateQuestion(engine, engine.getRule(rule.dottedName))}
							<ExplicableRule light dottedName={rule.dottedName} />
						</H3>
						<RuleInput
							dottedName={rule.dottedName}
							onChange={handleChange}
							autoFocus
							showSuggestions={false}
							onSubmit={onClose}
						/>
					</form>

					<Spacing lg />
					<Button size="XS" onPress={onClose}>
						Continuer
					</Button>
					<Spacing md />
				</>
			)}
		</PopoverWithTrigger>
	) : (
		<Value expression={rule.dottedName} linkToRule={false} />
	)
}

const StyledAnswer = styled(Grid)`
	text-align: right;
`
const StyledAnswerList = styled(Grid)`
	margin: ${({ theme }) => `${theme.spacings.md} 0`};

	font-family: ${({ theme }) => theme.fonts.main};
	:nth-child(2n) {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
		color-adjust: exact !important;
		outline: solid
			${({ theme }) =>
				`calc(${theme.spacings.md} / 2) ${theme.colors.bases.primary[100]}`};
	}
`
