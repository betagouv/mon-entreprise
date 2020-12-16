import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import AidesCovid from './AidesCovid'

export default function AutoEntrepreneurExplanation() {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
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
						dottedName: 'dirigeant . auto-entrepreneur . net après impôt',
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: palettes[0][0],
					},
					{
						dottedName: 'impôt',
						title: t('impôt'),
						color: palettes[1][0],
					},
					{
						dottedName:
							'dirigeant . auto-entrepreneur . cotisations et contributions',
						title: t('Cotisations'),
						color: palettes[1][1],
					},
				]}
			/>
		</section>
	)
}
