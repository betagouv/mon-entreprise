import exonerationCovid, { DottedNames } from 'exoneration-covid'
import Engine, { PublicodesExpression } from 'publicodes'
import { EngineProvider } from '@/components/utils/EngineContext'
import RuleInput from '@/components/conversation/RuleInput'
import { useState, useCallback } from 'react'
import Value from '@/components/EngineValue'
import { H3 } from '@/design-system/typography/heading'
import { Trans } from 'react-i18next'
import { Grid } from '@mui/material'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { useLocation } from 'react-router'

const covidEngine = new Engine(exonerationCovid)

export default function ExonérationCovid() {
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

	const [situation, setSituation] = useState<
		Partial<Record<DottedNames, PublicodesExpression | undefined>>
	>(() => {
		const defaultSituation = { ...params }
		covidEngine.setSituation(defaultSituation)

		return defaultSituation
	})

	const updateSituation = useCallback(
		(name: DottedNames, value: PublicodesExpression | undefined) => {
			const newSituation = { ...situation, [name]: value }
			setSituation(newSituation)
			covidEngine.setSituation(newSituation)
		},
		[situation]
	)

	const step2 = rootDottedNames.every((names) => params[names])

	return (
		<>
			<EngineProvider value={covidEngine}>
				{step2 ? (
					<>Page 2</>
				) : (
					<>
						<H3>{covidEngine.getRule('secteur').rawNode.question}</H3>
						<RuleInput
							dottedName={'secteur'}
							onChange={(value) => updateSituation('secteur', value)}
						/>

						<H3>{covidEngine.getRule("début d'activité").rawNode.question}</H3>
						<Spacing sm />

						<Grid item xs={12} sm={6}>
							<RuleInput
								dottedName="début d'activité"
								onChange={(value) => updateSituation("début d'activité", value)}
							/>
						</Grid>

						<H3>{covidEngine.getRule("lieu d'exercice").rawNode.question}</H3>
						<RuleInput
							dottedName="lieu d'exercice"
							onChange={(value) => updateSituation("lieu d'exercice", value)}
						/>
					</>
				)}

				<Spacing lg />

				<Grid container justifyContent="end">
					<Grid item xs={6} sm="auto">
						{step2 ? (
							<Button
								size="XS"
								to={{
									pathname: location.pathname,
									search: '',
								}}
							>
								{' '}
								← <Trans>Précédent</Trans>
							</Button>
						) : (
							<Button
								size="XS"
								light
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

				<hr />

				<Value expression={'secteur'} />
			</EngineProvider>
		</>
	)
}
