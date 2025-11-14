import '@/components/Distribution.css'

import { useTranslation } from 'react-i18next'

import { ÀQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/ÀQuoiServentMesCotisationsSection'
import { DroitsRetraite } from '@/components/simulationExplanation/DroitsRetraite'
import StackedRulesChart from '@/components/simulationExplanation/StackedRulesChart/StackedRulesChart'
import { H3 } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { Condition } from '../EngineValue/Condition'
import CotisationsForfaitaires from './IndépendantCotisationsForfaitaires'
import CotisationsRégularisation from './IndépendantCotisationsRégularisation'
import InstitutionsPartenaires from './InstitutionsPartenaires'

export default function IndépendantExplanation() {
	const { t } = useTranslation()

	return (
		<>
			<section>
				{/* TODO: remplacer Condition par When(Not)Applicable quand
						https://github.com/betagouv/mon-entreprise/issues/4035
						sera résolu */}
				<Condition expression="entreprise . date de création >= période . début d'année">
					<CotisationsForfaitaires />
				</Condition>
				<Condition expression="entreprise . date de création < période . début d'année">
					<CotisationsRégularisation />
				</Condition>
			</section>
			<Condition expression="dirigeant . rémunération . net . après impôt > 0 €/an">
				<section>
					<H3 as="h2">Répartition du revenu</H3>
					<StackedRulesChart
						data={{
							revenu: {
								dottedName: 'dirigeant . rémunération . net . après impôt',
								title: t(
									'pages.simulateurs.indépendant.répartition.revenu',
									'Revenu disponible'
								),
							},
							cotisations: {
								dottedName:
									'dirigeant . indépendant . cotisations et contributions',
								title: t(
									'pages.simulateurs.indépendant.répartition.cotisations',
									'Cotisations'
								),
							},
							impôt: {
								dottedName: 'impôt . montant',
								title: t(
									'pages.simulateurs.indépendant.répartition.impôt',
									'Impôt'
								),
							},
						}}
					/>
				</section>
			</Condition>
			<InstitutionsPartenaires />
			<DroitsRetraite />
			<ÀQuoiServentMesCotisationsSection regroupement={CotisationsSection} />
		</>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . retraite': [
		'dirigeant . indépendant . cotisations et contributions . retraite de base',
		'dirigeant . indépendant . cotisations et contributions . retraite complémentaire',
		'dirigeant . indépendant . cotisations et contributions . PCV',
	],
	'protection sociale . maladie': [
		'dirigeant . indépendant . cotisations et contributions . maladie',
		'dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie',
		'dirigeant . indépendant . cotisations et contributions . CSG-CRDS * 5.95 / 9.2',
	],
	'protection sociale . invalidité et décès': [
		'dirigeant . indépendant . cotisations et contributions . invalidité et décès',
	],
	'protection sociale . famille': [
		'dirigeant . indépendant . cotisations et contributions . allocations familiales',
		'dirigeant . indépendant . cotisations et contributions . CSG-CRDS * 0.95 / 9.2',
	],
	'protection sociale . autres': [
		'dirigeant . indépendant . cotisations et contributions . contributions spéciales',
		'dirigeant . indépendant . cotisations et contributions . CSG-CRDS * 2.3 / 9.2',
	],
	'protection sociale . formation': [
		'dirigeant . indépendant . cotisations et contributions . formation professionnelle',
	],
}
