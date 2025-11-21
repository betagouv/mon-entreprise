import { useTranslation } from 'react-i18next'

import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation/SalaryExplanation'
import { DottedName } from '@/domaine/publicodes/DottedName'

export default function Explications() {
	const { t } = useTranslation()

	return (
		<SalaryExplanation
			cotisationsSection={CotisationsSection}
			répartitionRevenuData={{
				revenu: {
					dottedName: 'salarié . rémunération . net . payé après impôt',
					title: t(
						'pages.simulateurs.salarié.explications.répartition.revenu',
						'Revenu disponible'
					),
				},
				cotisations: {
					dottedName: 'salarié . cotisations',
					title: t(
						'pages.simulateurs.salarié.explications.répartition.cotisations',
						'Cotisations'
					),
				},
				impôt: {
					dottedName: 'impôt . montant',
					title: t(
						'pages.simulateurs.salarié.explications.répartition.impôt',
						'Impôt'
					),
				},
			}}
			avecFicheDePaie
		/>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . maladie': [
		'salarié . cotisations . maladie',
		'salarié . cotisations . prévoyances',
		'salarié . cotisations . prévoyances . santé',
		'salarié . cotisations . ATMP',
	],
	'protection sociale . retraite': [
		'salarié . cotisations . vieillesse',
		'salarié . cotisations . retraite complémentaire',
		'salarié . cotisations . CEG',
		'salarié . cotisations . CET',
		// 'salarié . cotisations . retraite supplémentaire',
	],
	'protection sociale . famille': [
		'salarié . cotisations . allocations familiales',
	],
	'protection sociale . assurance chômage': [
		'salarié . cotisations . AGS',
		'salarié . cotisations . chômage',
	],
	'protection sociale . formation': [
		"salarié . cotisations . taxe d'apprentissage",
		'salarié . cotisations . formation professionnelle',
		'salarié . cotisations . CPF CDD',
	],
	'protection sociale . transport': [
		'salarié . cotisations . versement mobilité',
	],
	'protection sociale . autres': [
		'salarié . cotisations . CSG-CRDS',
		'salarié . cotisations . APEC',
		'salarié . cotisations . FNAL',
		'salarié . cotisations . CSA',
		'salarié . cotisations . forfait social',
		'salarié . cotisations . PEEC',
		'salarié . cotisations . contribution au dialogue social',
	],
}
