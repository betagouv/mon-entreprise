import { useTranslation } from 'react-i18next'

import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation/SalaryExplanation'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { FicheDePaie } from './FicheDePaie/FicheDePaie'

export default function Explications() {
	const { t } = useTranslation()

	return (
		<SalaryExplanation
			cotisationsSection={CotisationsSection}
			répartitionRevenuData={{
				revenu: {
					dottedName: 'assimilé salarie . rémunération . nette . après impôt',
					title: t(
						'pages.simulateurs.assimilé-salarie.explications.répartition.revenu',
						'Revenu disponible'
					),
				},
				cotisations: {
					dottedName: 'assimilé salarie . cotisations',
					title: t(
						'pages.simulateurs.assimilé-salarie.explications.répartition.cotisations',
						'Cotisations'
					),
				},
				impôt: {
					dottedName: 'impôt . montant',
					title: t(
						'pages.simulateurs.assimilé-salarie.explications.répartition.impôt',
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
		'assimilé salarie . cotisations . maladie',
		'assimilé salarie . cotisations . prévoyances',
		'assimilé salarie . cotisations . prévoyances . santé',
		'assimilé salarie . cotisations . ATMP',
	],
	'protection sociale . retraite': [
		'assimilé salarie . cotisations . vieillesse',
		'assimilé salarie . cotisations . retraite complémentaire',
		'assimilé salarie . cotisations . CEG',
		'assimilé salarie . cotisations . CET',
		// 'assimilé salarie . cotisations . retraite supplémentaire',
	],
	'protection sociale . famille': [
		'assimilé salarie . cotisations . allocations familiales',
	],
	'protection sociale . formation': [
		"assimilé salarie . cotisations . taxe d'apprentissage",
		'assimilé salarie . cotisations . formation professionnelle',
	],
	'protection sociale . transport': [
		'assimilé salarie . cotisations . versement mobilité',
	],
	'protection sociale . autres': [
		'assimilé salarie . cotisations . CSG-CRDS',
		'assimilé salarie . cotisations . FNAL',
		'assimilé salarie . cotisations . CSA',
		'assimilé salarie . cotisations . forfait social',
		'assimilé salarie . cotisations . PEEC',
		'assimilé salarie . cotisations . Apec',
	],
}
