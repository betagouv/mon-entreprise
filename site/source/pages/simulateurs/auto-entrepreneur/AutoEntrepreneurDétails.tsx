import { DottedName } from 'modele-social'
import { Trans, useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

import { ÀQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/ÀQuoiServentMesCotisationsSection'
import { InstitutionsPartenairesAutoEntrepreneur } from '@/components/simulationExplanation/InstitutionsPartenaires'
import StackedBarChart from '@/components/StackedBarChart'
import { H2 } from '@/design-system/typography/heading'

export const AutoEntrepreneurDétails = () => {
	const { t } = useTranslation()
	const { colors } = useTheme()

	return (
		<section>
			<H2>
				<Trans>Répartition du chiffre d'affaires</Trans>
			</H2>
			<StackedBarChart
				data={[
					{
						dottedName: 'dirigeant . rémunération . net . après impôt',
						title: t("Revenu (incluant les dépenses liées à l'activité)"),
						color: colors.bases.primary[600],
					},
					{
						dottedName: 'impôt . montant',
						title: t('impôt'),
						color: colors.bases.secondary[500],
					},
					{
						dottedName:
							'dirigeant . auto-entrepreneur . cotisations et contributions',
						title: t('Cotisations'),
						color: colors.extended.grey[700],
					},
				]}
			/>
			<InstitutionsPartenairesAutoEntrepreneur />
			<ÀQuoiServentMesCotisationsSection regroupement={CotisationsSection} />
		</section>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite':
		[
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite de base',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite complémentaire',
		],
	'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . maladie-maternité':
		[
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . maladie-maternité',
		],
	'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . invalidité-décès':
		[
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . invalidité-décès',
		],
	'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . autres contributions':
		[
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . autres contributions',
		],
}
