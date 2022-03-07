import exonerationCovid, { DottedNames } from 'exoneration-covid'
import Engine, { PublicodesExpression } from 'publicodes'
import { EngineProvider } from '@/components/utils/EngineContext'
import RuleInput from '@/components/conversation/RuleInput'
import { useState, useCallback } from 'react'
import Value from '@/components/EngineValue'
import { H3 } from '@/design-system/typography/heading'

const covidEngine = new Engine(exonerationCovid)

export default function ExonérationCovid() {
	const [situation, setSituation] = useState<
		Partial<Record<DottedNames, PublicodesExpression | undefined>>
	>({})
	const updateSituation = useCallback(
		(name: DottedNames, value: PublicodesExpression | undefined) => {
			const newSituation = { ...situation, [name]: value }
			setSituation(newSituation)
			covidEngine.setSituation(newSituation)
		},
		[situation]
	)

	return (
		<>
			<EngineProvider value={covidEngine}>
				<RuleInput
					dottedName={'secteur'}
					onChange={(value) => updateSituation('secteur', value)}
				/>

				<H3>{covidEngine.getRule("début d'activité").rawNode.question}</H3>
				<RuleInput
					dottedName="début d'activité"
					onChange={(value) => updateSituation("début d'activité", value)}
				/>

				<H3>{covidEngine.getRule("lieu d'exercice").rawNode.question}</H3>
				<RuleInput
					dottedName="lieu d'exercice"
					onChange={(value) => updateSituation("début d'activité", value)}
				/>

				<hr />

				<Value expression={'secteur'} />
			</EngineProvider>
		</>
	)
}
