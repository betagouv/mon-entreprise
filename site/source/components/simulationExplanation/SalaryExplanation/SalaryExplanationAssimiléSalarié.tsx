import { useTranslation } from 'react-i18next'

import { DottedName } from '@/domaine/publicodes/DottedName'

import SalaryExplanation from './SalaryExplanation'

export default function SalaryExplanationAssimiléSalarié() {
	const { t } = useTranslation()

	return (
		<SalaryExplanation
			cotisationsSection={CotisationsSection}
			répartitionRevenuData={{
				revenu: {
					dottedName: 'assimilé salarié . rémunération . nette . après impôt',
					title: t(
						'pages.simulateurs.assimilé-salarié.répartition.revenu',
						'Revenu disponible'
					),
				},
				cotisations: {
					dottedName: 'assimilé salarié . cotisations',
					title: t(
						'pages.simulateurs.assimilé-salarié.répartition.cotisations',
						'Cotisations'
					),
				},
				impôt: {
					dottedName: 'impôt . montant',
					title: t(
						'pages.simulateurs.assimilé-salarié.répartition.impôt',
						'Impôt'
					),
				},
			}}
		/>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . maladie': [
		'assimilé salarié . cotisations . maladie',
		'assimilé salarié . cotisations . prévoyances',
		'assimilé salarié . cotisations . prévoyances . santé',
		'assimilé salarié . cotisations . ATMP',
	],
	'protection sociale . retraite': [
		'assimilé salarié . cotisations . vieillesse',
		'assimilé salarié . cotisations . retraite complémentaire',
		'assimilé salarié . cotisations . CEG',
		'assimilé salarié . cotisations . CET',
		// 'assimilé salarié . cotisations . retraite supplémentaire',
	],
	'protection sociale . famille': [
		'assimilé salarié . cotisations . allocations familiales',
	],
	'protection sociale . formation': [
		"assimilé salarié . cotisations . taxe d'apprentissage",
		'assimilé salarié . cotisations . formation professionnelle',
	],
	'protection sociale . transport': [
		'assimilé salarié . cotisations . versement mobilité',
	],
	'protection sociale . autres': [
		'assimilé salarié . cotisations . CSG-CRDS',
		'assimilé salarié . cotisations . FNAL',
		'assimilé salarié . cotisations . CSA',
		'assimilé salarié . cotisations . forfait social',
		'assimilé salarié . cotisations . PEEC',
	],
}
