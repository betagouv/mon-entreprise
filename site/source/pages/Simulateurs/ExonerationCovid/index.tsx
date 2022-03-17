import exonerationCovid, { DottedNames } from 'exoneration-covid'
import Engine, { PublicodesExpression } from 'publicodes'
import { EngineProvider } from '@/components/utils/EngineContext'
import RuleInput from '@/components/conversation/RuleInput'
import { useState, useCallback, useRef, useEffect } from 'react'
import { H3 } from '@/design-system/typography/heading'
import { Trans } from 'react-i18next'
import { Grid } from '@mui/material'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { useLocation } from 'react-router'
import { FormulaireS1S1Bis } from './FormulaireS1S1Bis'

export default function ExonérationCovid() {
	// Use ref to keep state with react fast refresh
	const { current: exoCovidEngine } = useRef(
		new Engine<DottedNames>(exonerationCovid)
	)

	const rootDottedNames = [
		'secteur',
		"début d'activité",
		"lieu d'exercice",
	] as const

	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const params = Object.fromEntries(searchParams.entries()) as {
		[key in typeof rootDottedNames[number]]?: string
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location])

	const [situation, setSituation] = useState<
		Partial<Record<DottedNames, PublicodesExpression | undefined>>
	>(() => {
		const defaultSituation = { ...params }
		exoCovidEngine.setSituation(defaultSituation)

		return defaultSituation
	})

	const updateSituation = useCallback(
		(name: DottedNames, value: PublicodesExpression | undefined) => {
			const newSituation = { ...situation, [name]: value }
			setSituation(newSituation)
			exoCovidEngine.setSituation(newSituation)
		},
		[exoCovidEngine, situation]
	)

	const setStep1Situation = useCallback(() => {
		const step1Situation = Object.fromEntries(
			Object.entries(situation).filter(
				([dotName]) => !dotName.startsWith('mois . ')
			)
		)
		setSituation(step1Situation)
		exoCovidEngine.setSituation(step1Situation)
	}, [exoCovidEngine, situation])

	const step2 = rootDottedNames.every((names) => params[names])

	return (
		<EngineProvider value={exoCovidEngine}>
			{step2 ? (
				<>
					<FormulaireS1S1Bis onChange={updateSituation} />
				</>
			) : (
				<>
					<Grid item xs={12}>
						<H3>{exoCovidEngine.getRule('secteur').rawNode.question}</H3>
					</Grid>

					<Grid item xs={8}>
						<RuleInput
							dottedName={'secteur'}
							onChange={(value) => updateSituation('secteur', value)}
						/>
					</Grid>

					<Grid item xs={12}>
						<H3>
							{exoCovidEngine.getRule("début d'activité").rawNode.question}
						</H3>
					</Grid>

					<Spacing sm />

					<Grid item xs={12} sm={6}>
						<RuleInput
							dottedName="début d'activité"
							onChange={(value) => updateSituation("début d'activité", value)}
						/>
					</Grid>

					<Grid item xs={12}>
						<H3>
							{exoCovidEngine.getRule("lieu d'exercice").rawNode.question}
						</H3>
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

			<Grid container>
				<Grid item xs></Grid>
			</Grid>

			<Grid container justifyContent={step2 ? '' : 'end'}>
				<Grid item xs={6} sm="auto">
					{step2 ? (
						<Button
							size="XS"
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
							size="XS"
							isDisabled={!rootDottedNames.every((names) => situation[names])}
							to={() => {
								rootDottedNames.forEach((key) =>
									searchParams.append(key, situation[key]?.toString() ?? '')
								)

								return {
									pathname: location.pathname,
									search: searchParams.toString(),
								}
							}}
						>
							<Trans>Suivant</Trans> →
						</Button>
					)}
				</Grid>
			</Grid>

			<Spacing lg />
		</EngineProvider>
	)
}
