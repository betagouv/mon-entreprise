import '@/components/Distribution.css'

import { Condition } from '@/components/EngineValue/Condition'
import { ÀQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/ÀQuoiServentMesCotisations/ÀQuoiServentMesCotisationsSection'
import { DottedName } from '@/domaine/publicodes/DottedName'
import DroitsRetraite from '@/pages/simulateurs/indépendant/components/DroitsRetraite'

import ExplicationCotisations from './ExplicationCotisations'
import InstitutionsPartenaires from './InstitutionsPartenaires'
import RépartitionRevenu from './RépartitionRevenu'

export default function Explications() {
	return (
		<>
			<ExplicationCotisations />
			<Condition expression="indépendant . rémunération . nette . après impôt > 0 €/an">
				<RépartitionRevenu />
			</Condition>
			<InstitutionsPartenaires />
			<DroitsRetraite />
			<ÀQuoiServentMesCotisationsSection regroupement={CotisationsSection} />
		</>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . retraite': [
		'indépendant . cotisations et contributions . cotisations . retraite de base',
		'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
		'indépendant . cotisations et contributions . cotisations . PCV',
	],
	'protection sociale . maladie': [
		'indépendant . cotisations et contributions . cotisations . maladie',
		'indépendant . cotisations et contributions . cotisations . indemnités journalières maladie',
		'indépendant . cotisations et contributions . CSG-CRDS * 5.95 / 9.2',
	],
	'protection sociale . invalidité et décès': [
		'indépendant . cotisations et contributions . cotisations . invalidité et décès',
	],
	'protection sociale . famille': [
		'indépendant . cotisations et contributions . cotisations . allocations familiales',
		'indépendant . cotisations et contributions . CSG-CRDS * 0.95 / 9.2',
	],
	'protection sociale . autres': [
		'indépendant . cotisations et contributions . contributions spéciales',
		'indépendant . cotisations et contributions . CSG-CRDS * 2.3 / 9.2',
	],
	'protection sociale . formation': [
		'indépendant . cotisations et contributions . formation professionnelle',
	],
}
