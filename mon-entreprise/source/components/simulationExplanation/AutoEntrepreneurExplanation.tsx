import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { EngineContext, useEngine } from 'Components/utils/EngineContext'
import { evaluateRule } from 'publicodes'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import AidesCovid from './AidesCovid'

export default function AutoEntrepreneurExplanation() {
	const engine = useEngine()
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	const targetUnit = useSelector(targetUnitSelector)
	const impôt = evaluateRule(engine, 'impôt', { unité: targetUnit })

	return (
		<section>
			<AidesCovid />
			<br />
			<h2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						...evaluateRule(
							engine,
							'dirigeant . auto-entrepreneur . net après impôt',
							{ unité: targetUnit }
						),
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0],
					},

					...(impôt.nodeValue
						? [{ ...impôt, title: t('impôt'), color: palettes[1][0] }]
						: []),
					{
						...evaluateRule(
							engine,
							'dirigeant . auto-entrepreneur . cotisations et contributions',
							{ unité: targetUnit }
						),
						title: t('Cotisations'),
						color: palettes[1][1],
					},
				]}
			/>
		</section>
	)
}
