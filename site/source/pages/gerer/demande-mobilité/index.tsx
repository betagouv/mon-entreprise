import RuleInput from '@/components/conversation/RuleInput'
import { WhenApplicable, WhenNotApplicable } from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import BrowserOnly from '@/components/utils/BrowserOnly'
import Emoji from '@/components/utils/Emoji'
import { EngineContext, EngineProvider } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { usePersistingState } from '@/components/utils/persistState'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { headings } from '@/design-system/typography'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
import { evaluateQuestion, hash, omit } from '@/utils'
import { Grid } from '@mui/material'
import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'
import {
	Fragment,
	lazy,
	Suspense,
	useCallback,
	useContext,
	useState,
} from 'react'
import { TrackPage } from '../../../ATInternetTracking'
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

			return (
				evaluation.nodeValue !== null &&
				(evaluateQuestion(engine, rule) ||
					rule.rawNode.API ||
					rule.rawNode.type)
			)
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
				setSituation((situation) => omit(situation, dottedName))
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
	const missingValues = [
		...new Set(
			fields.flatMap(
				({ dottedName }) => engine.evaluate(dottedName)?.missingVariables ?? []
			)
		),
	].map((dottedName) => engine.getRule(dottedName))

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
													{evaluateQuestion(
														engine,
														engine.getRule(dottedName)
													) ?? ''}
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
				<BrowserOnly>
					<Suspense fallback={null}>
						<LazyEndBlock fields={fields} missingValues={missingValues} />
					</Suspense>
				</BrowserOnly>
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
