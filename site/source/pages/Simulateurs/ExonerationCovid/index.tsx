import RuleInput from '@/components/conversation/RuleInput'
import {
	EngineProvider,
	useEngineKeepState,
	useEngine,
} from '@/components/utils/EngineContext'
import {
	useSynchronizedSituationState,
	SituationStateProvider,
} from '@/components/utils/SituationContext'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Grid } from '@mui/material'
import exonerationCovid, { DottedNames } from 'exoneration-covid'
import Engine, { PublicodesExpression } from 'publicodes'
import { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router'
import { FormulaireS1S1Bis } from './FormulaireS1S1Bis'
import { FormulaireS2 } from './FormulaireS2'

const exoCovidEngine = new Engine(exonerationCovid)

export default function ExonérationCovidProvider() {
	const engine = useEngineKeepState(exoCovidEngine)

	return (
		<EngineProvider value={engine}>
			<ExonérationCovid />
		</EngineProvider>
	)
}

const rootDottedNames = [
	'secteur',
	"début d'activité",
	"lieu d'exercice",
] as const

const ExonérationCovid = () => {
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const params = Object.fromEntries(searchParams.entries()) as {
		[key in typeof rootDottedNames[number]]?: string
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location])

	const engine = useEngine<DottedNames>()
	const situationState = useSynchronizedSituationState<DottedNames>(params)
	const { situation, setSituation } = situationState

	const updateSituation = useCallback(
		(name: DottedNames, value: PublicodesExpression | undefined) => {
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
					<FormulaireS1S1Bis onChange={updateSituation} />
				) : (
					<FormulaireS2 onChange={updateSituation} />
				)
			) : (
				<>
					<Grid item xs={12}>
						<H3>{engine.getRule('secteur').rawNode.question}</H3>
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

			<Grid container justifyContent={step2 ? '' : 'end'}>
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
										to: () => {
											rootDottedNames.forEach((key) =>
												searchParams.append(
													key,
													situation[key]?.toString() ?? ''
												)
											)

											return {
												pathname: location.pathname,
												search: searchParams.toString(),
											}
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
