import { TrackPage } from '@/ATInternetTracking'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import {
	SituationStateProvider,
	useSynchronizedSituationState,
} from '@/components/utils/SituationContext'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { DottedName as ExoCovidDottedNames } from 'exoneration-covid'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'
import {
	createSearchParams,
	useLocation,
	useSearchParams,
} from 'react-router-dom'
import { useExoCovidEngine } from '.'
import { FormulaireS1S1Bis } from './FormulaireS1S1Bis'
import { FormulaireS2 } from './FormulaireS2'

const rootDottedNames = [
	'secteur',
	"début d'activité",
	"lieu d'exercice",
] as const

export const ExonérationCovid = () => {
	const location = useLocation()
	const [searchParams] = useSearchParams()
	const params = Object.fromEntries(searchParams.entries()) as {
		[key in typeof rootDottedNames[number]]?: string
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location])

	const engine = useExoCovidEngine()
	const situationState = useSynchronizedSituationState(engine, params)
	const { situation, setSituation } = situationState

	const updateSituation = useCallback(
		(name: ExoCovidDottedNames, value: PublicodesExpression | undefined) => {
			setSituation({ ...situation, [name]: value })
		},
		[setSituation, situation]
	)

	const setStep1Situation = useCallback(() => {
		const step1Situation = Object.fromEntries(
			Object.entries(situation).filter(([dotName]) =>
				(rootDottedNames as readonly string[]).includes(dotName)
			)
		)
		setSituation(step1Situation)
	}, [setSituation, situation])

	const step2 = rootDottedNames.every((names) => params[names])

	return (
		<SituationStateProvider value={situationState}>
			{step2 ? (
				engine.evaluate('secteur').nodeValue !== 'S2' ? (
					<>
						<TrackPage name="S1_S1bis" />
						<FormulaireS1S1Bis onChange={updateSituation} />
					</>
				) : (
					<>
						<TrackPage name="S2" />

						<FormulaireS2 onChange={updateSituation} />
					</>
				)
			) : (
				<>
					<TrackPage name="accueil" />
					<Grid item xs={12}>
						<H3>
							{engine.getRule('secteur').rawNode.question}
							<ExplicableRule dottedName="secteur" light />
						</H3>
					</Grid>

					<Grid item xs={12} sm={8}>
						<RuleInput
							dottedName={'secteur'}
							onChange={(value) => updateSituation('secteur', value)}
						/>
					</Grid>

					<Grid item xs={12}>
						<H3>{engine.getRule("début d'activité").rawNode.question}</H3>
					</Grid>

					<Grid item xs={12} sm={6}>
						<RuleInput
							dottedName="début d'activité"
							onChange={(value) => updateSituation("début d'activité", value)}
						/>
					</Grid>

					<Grid item xs={12}>
						<H3>{engine.getRule("lieu d'exercice").rawNode.question}</H3>
					</Grid>

					<Grid item xs={12}>
						<RuleInput
							dottedName="lieu d'exercice"
							onChange={(value) => updateSituation("lieu d'exercice", value)}
						/>
					</Grid>
				</>
			)}

			<Spacing lg />

			<Grid container css={step2 ? '' : `justify-content: end`}>
				<Grid item xs={6} sm="auto">
					{step2 ? (
						<Button
							size="MD"
							to={{
								pathname: location.pathname,
								search: '',
							}}
							onClick={setStep1Situation}
						>
							← <Trans>Précédent</Trans>
						</Button>
					) : (
						<Button
							size="MD"
							isDisabled={!rootDottedNames.every((names) => situation[names])}
							{...(rootDottedNames.every((names) => situation[names])
								? {
										to: {
											pathname: location.pathname,
											search: createSearchParams(
												Object.fromEntries(
													rootDottedNames
														.filter((key) => situation[key])
														.map((key) => [
															key,
															situation[key]?.toString() ?? '',
														])
												)
											).toString(),
										},
								  }
								: null)}
						>
							<Trans>Suivant</Trans> →
						</Button>
					)}
				</Grid>
			</Grid>

			<Spacing lg />
		</SituationStateProvider>
	)
}
