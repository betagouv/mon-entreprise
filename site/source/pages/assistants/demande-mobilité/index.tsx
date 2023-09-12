import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'
import { Fragment, lazy, Suspense, useCallback, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import RuleInput from '@/components/conversation/RuleInput'
import { WhenApplicable, WhenNotApplicable } from '@/components/EngineValue'
import BrowserOnly from '@/components/utils/BrowserOnly'
import { EngineContext, EngineProvider } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { usePersistingState } from '@/components/utils/persistState'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import PopoverConfirm from '@/design-system/popover/PopoverConfirm'
import { headings } from '@/design-system/typography'
import { Intro, SmallBody } from '@/design-system/typography/paragraphs'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import {
	buildSituationFromObject,
	evaluateQuestion,
	getMeta,
	hash,
	omit,
} from '@/utils'

import formulaire from './demande-mobilité.yaml'

const LazyEndBlock = import.meta.env.SSR
	? () => null
	: lazy(() => import('./EndBlock'))

// Remove Guide urssaf from Ressource utiles section
const config = { situation: { dirigeant: 'non' } }

export default function PageMobilité() {
	useSimulationConfig({ key: 'page-mobilité', config })
	const engine = new Engine(formulaire)

	return (
		<>
			<Intro>
				Vous trouverez ici toutes les informations pour remplir une demande de
				certificat A1 afin d'être couverts pendant la période de travail à
				l'étranger.
			</Intro>
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
			const evaluation = engine.evaluate({ 'est applicable': dottedName })
			const rule = engine.getRule(dottedName)
			const meta = getMeta<{ affichage?: string }>(rule.rawNode, {})

			return (
				evaluation.nodeValue === true &&
				(rule.rawNode.question ||
					rule.rawNode.API ||
					rule.rawNode.type ||
					meta?.affichage)
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

	const { t } = useTranslation()

	const onChange = useCallback(
		(dottedName: string, value?: PublicodesExpression) => {
			if (value === undefined) {
				setSituation((situation) => omit(situation, dottedName))
			} else if (engine.getRule(dottedName).rawNode.API === 'commune') {
				type Value = {
					batchUpdate: {
						nom: PublicodesExpression
						'code postal': PublicodesExpression
					}
				}
				const commune = {
					nom: (value as Value).batchUpdate.nom,
					'code postal': (value as Value).batchUpdate['code postal'],
				}
				setSituation((situation) => ({
					...buildSituationFromObject(dottedName, commune),
					...situation,
				}))
			} else {
				setSituation((situation) => ({
					...situation,
					[dottedName]: value,
				}))
			}
		},
		[setSituation]
	)

	const handleClear = useCallback(() => {
		setSituation({})
	}, [setSituation])

	engine.setSituation(situation)

	const fields = useFields(engine)
	const missingValues = Object.keys(
		fields.reduce(
			(missingValues, { dottedName, rawNode }) => ({
				...missingValues,
				...(rawNode.type === 'groupe'
					? {}
					: engine.evaluate(dottedName).missingVariables),
			}),
			{}
		)
	).map((dottedName) => engine.getRule(dottedName))

	return (
		<>
			<Grid container spacing={2}>
				{fields.map(
					({
						rawNode: { description, type, question, ...rawNode },
						title,
						dottedName,
					}) => {
						const meta = getMeta<{ affichage?: string }>(rawNode, {})

						const headerLevel = Math.min(dottedName.split(' . ').length + 1, 4)
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
												style={{
													color: '#ff2d96',
													backgroundColor: 'inherit',
												}}
											>
												{description}
											</SmallBody>
										</Grid>
									</WhenApplicable>
								) : (
									<Grid
										item
										xs={12}
										md={
											(question || type === 'booléen') &&
											meta?.affichage !== 'select'
												? 12
												: 6
										}
									>
										{question && (
											<div
												style={{
													marginTop: '-1rem',
												}}
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
											id={dottedName.replace(/\s|\./g, '_')}
											dottedName={dottedName as DottedName}
											onChange={(value) => onChange(dottedName, value)}
											aria-label={
												question &&
												evaluateQuestion(engine, engine.getRule(dottedName))
											}
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
					style={{
						textAlign: 'right',
					}}
				>
					<PopoverConfirm
						small
						trigger={(buttonProps) => (
							<Button size="XS" light {...buttonProps}>
								<Emoji emoji="🗑" /> <Trans>Effacer mes réponses</Trans>
							</Button>
						)}
						onConfirm={handleClear}
						title={t('Êtes-vous sûr de vouloir effacer vos réponses ?')}
					>
						<Trans>Cette opération n'est pas réversible.</Trans>
					</PopoverConfirm>
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
