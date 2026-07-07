import { useTranslation } from 'react-i18next'

import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation/SalaryExplanation'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { FicheDePaie } from '@/pages/simulateurs/salarie/components/FicheDePaie/FicheDePaie'

export default function Explications() {
	const { t } = useTranslation()

	return (
		<SalaryExplanation
			cotisationsSection={CotisationsSection}
			répartitionRevenuData={{
				revenu: {
					dottedName: 'salarie . rémunération . net . payé après impôt',
					title: t(
						'pages.simulateurs.salarie.explications.répartition.revenu',
						'Revenu disponible'
					),
				},
				cotisations: {
					dottedName: 'salarie . cotisations',
					title: t(
						'pages.simulateurs.salarie.explications.répartition.cotisations',
						'Cotisations'
					),
				},
				impôt: {
					dottedName: 'impôt . montant',
					title: t(
						'pages.simulateurs.salarie.explications.répartition.impôt',
						'Impôt'
					),
				},
			}}
			ficheDePaie={<FicheDePaie />}
		/>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . maladie': [
		'salarie . cotisations . maladie',
		'salarie . cotisations . prévoyances',
		'salarie . cotisations . prévoyances . santé',
		'salarie . cotisations . ATMP',
	],
	'protection sociale . retraite': [
		'salarie . cotisations . vieillesse',
		'salarie . cotisations . retraite complémentaire',
		'salarie . cotisations . CEG',
		'salarie . cotisations . CET',
		// 'salarie . cotisations . retraite supplémentaire',
	],
	'protection sociale . famille': [
		'salarie . cotisations . allocations familiales',
	],
	'protection sociale . assurance chômage': [
		'salarie . cotisations . AGS',
		'salarie . cotisations . chômage',
	],
	'protection sociale . formation': [
		"salarie . cotisations . taxe d'apprentissage",
		'salarie . cotisations . formation professionnelle',
		'salarie . cotisations . CPF CDD',
	],
	'protection sociale . transport': [
		'salarie . cotisations . versement mobilité',
	],
	'protection sociale . autres': [
		'salarie . cotisations . CSG-CRDS',
		'salarie . cotisations . APEC',
		'salarie . cotisations . FNAL',
		'salarie . cotisations . CSA',
		'salarie . cotisations . forfait social',
		'salarie . cotisations . PEEC',
		'salarie . cotisations . contribution au dialogue social',
	],
}
