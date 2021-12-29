import { Grid } from '@mui/material'
import RuleInput from 'Components/conversation/RuleInput'
import { WhenApplicable, WhenNotApplicable } from 'Components/EngineValue'
import PageHeader from 'Components/PageHeader'
import Emoji from 'Components/utils/Emoji'
import { EngineContext, EngineProvider } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { usePersistingState } from 'Components/utils/persistState'
import { Button } from 'DesignSystem/buttons'
import { Spacing } from 'DesignSystem/layout'
import { headings } from 'DesignSystem/typography'
import { Intro, SmallBody } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import Engine, {
	PublicodesExpression,
	UNSAFE_isNotApplicable,
} from 'publicodes'
import { equals, isEmpty, omit } from 'ramda'
import {
	Fragment,
	lazy,
	Suspense,
	useCallback,
	useContext,
	useState,
} from 'react'
import { TrackPage } from '../../../ATInternetTracking'
import { hash } from '../../../utils'
import formulaire from './demande-mobilité.yaml'
import picture from './undraw_Traveling_re_weve.svg'

const LazyEndBlock = import.meta.env.SSR
	? () => null
	: lazy(() => import('./EndBlock'))

export default function PageMobilité() {
	const engine = new Engine(formulaire)

	return (
		<>
			<PageHeader
				titre={'Demande de mobilité internationale'}
				picture={picture}
			>
				<Intro>
					Vous trouverez ici toutes les informations pour remplir une demande de
					certificat A1 afin d'être couverts pendant la période de travail à
					l'étranger.
				</Intro>
			</PageHeader>
			<EngineProvider value={engine}>
				<FormulairePublicodes />
			</EngineProvider>
		</>
	)
}

const useFields = (
	engine: Engine<string>
): Array<ReturnType<Engine['getRule']>> => {
	return Object.keys(engine.getParsedRules())
		.filter((dottedName) => {
			const evaluation = engine.evaluate(dottedName)
			const rule = engine.getRule(dottedName)
			const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
			const displayRule =
				(isNotApplicable === false &&
					(equals(evaluation.missingVariables, { [dottedName]: 1 }) ||
						isEmpty(evaluation.missingVariables)) &&
					(rule.rawNode.question || rule.rawNode.API || rule.rawNode.type)) ||
				(isNotApplicable === false &&
					rule.rawNode.type === 'groupe' &&
					Object.keys(evaluation.missingVariables).every((childDottedName) =>
						childDottedName.startsWith(dottedName)
					))
			return displayRule
		})
		.map((dottedName) => engine.getRule(dottedName))
}

const VERSION = hash(JSON.stringify(formulaire))
function FormulairePublicodes() {
	const engine = useContext(EngineContext)
	const [situation, setSituation] = usePersistingState<
		Record<string, PublicodesExpression>
	>(`formulaire-détachement:${VERSION}`, {})
	const onChange = useCallback(
		(dottedName, value) => {
			if (value === undefined) {
				setSituation((situation) => omit([dottedName], situation))
			} else {
				setSituation((situation) => ({
					...situation,
					[dottedName]: value,
				}))
			}
		},
		[setSituation]
	)

	// This is a hack to reset value inside all uncontrolled fields input on clear
	const [clearFieldsKey, setKey] = useState(0)
	const handleClear = useCallback(() => {
		setSituation({})
		setKey(clearFieldsKey + 1)
	}, [clearFieldsKey, setSituation])

	engine.setSituation(situation)
	const fields = useFields(engine)
	const missingValues = fields.filter(
		({ dottedName }) => !isEmpty(engine.evaluate(dottedName).missingVariables)
	)
	return (
		<>
			<Grid container spacing={2}>
				{fields.map(
					({ rawNode: { description, type, question }, title, dottedName }) => {
						const headerLevel = Math.min(dottedName.split(' . ').length + 1, 6)
						const HeaderComponent = headings.fromLevel(headerLevel)

						return (
							<Fragment key={dottedName}>
								{type === 'groupe' ? (
									<Grid item xs={12}>
										{title && <HeaderComponent>{title}</HeaderComponent>}
										{description && <Markdown>{description}</Markdown>}
									</Grid>
								) : type === 'notification' ? (
									<WhenApplicable dottedName={dottedName as DottedName}>
										<Grid item xs={12}>
											<SmallBody
												css={`
													color: #ff2d96;
												`}
											>
												{description}
											</SmallBody>
										</Grid>
									</WhenApplicable>
								) : (
									<Grid
										item
										xs={12}
										md={question || type === 'booléen' ? 12 : 6}
									>
										{question && (
											<div
												css={`
													margin-top: -1rem;
												`}
											>
												{' '}
												<Markdown>
													{typeof question !== 'string'
														? (engine.evaluate(question) as any).nodeValue
														: question}
												</Markdown>
											</div>
										)}

										<RuleInput
											id={dottedName}
											dottedName={dottedName as DottedName}
											onChange={(value) => onChange(dottedName, value)}
										/>
										{question && type === undefined && description && (
											<Markdown>{description}</Markdown>
										)}
									</Grid>
								)}
							</Fragment>
						)
					}
				)}
			</Grid>
			<Spacing xl />
			<WhenNotApplicable dottedName={'situation . notification' as DottedName}>
				{!import.meta.env.SSR && (
					<Suspense fallback={null}>
						<LazyEndBlock fields={fields} missingValues={missingValues} />
					</Suspense>
				)}
			</WhenNotApplicable>

			{!!Object.keys(situation).length && (
				<div
					css={`
						text-align: right;
					`}
				>
					<Button size="XS" light onPress={handleClear}>
						<Emoji emoji={'🗑️'} /> Effacer mes réponses
					</Button>
				</div>
			)}
			{!Object.keys(situation).length ? (
				<TrackPage name="accueil" />
			) : missingValues.length ? (
				<TrackPage name="commence" />
			) : null}
		</>
	)
}
