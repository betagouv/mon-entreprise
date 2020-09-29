import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { EngineContext } from 'Components/utils/EngineContext'
import { default as React, useContext } from 'react'
import { useTranslation } from 'react-i18next'

export default function IndépendantExplanation() {
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<h2>Répartition de la rémunération totale</h2>
			<StackedBarChart
				data={[
					{
						...engine.evaluate('revenu net après impôt'),
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{ ...engine.evaluate('impôt'), color: palettes[1][0] },
					{
						...engine.evaluate(
							'dirigeant . indépendant . cotisations et contributions'
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}
