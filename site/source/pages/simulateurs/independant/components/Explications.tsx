import '@/components/Distribution.css'

import { Condition } from '@/components/EngineValue/Condition'
import { AQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/AQuoiServentMesCotisations/AQuoiServentMesCotisationsSection'
import { DottedName } from '@/domaine/publicodes/DottedName'
import DroitsRetraite from '@/pages/simulateurs/independant/components/DroitsRetraite'

import ExplicationCotisations from './ExplicationCotisations'
import InstitutionsPartenaires from './InstitutionsPartenaires'
import RépartitionRevenu from './RepartitionRevenu'

export default function Explications() {
	return (
		<>
			<ExplicationCotisations />
			<Condition expression="independant . rémunération . nette . après impôt > 0 €/an">
				<RépartitionRevenu />
			</Condition>
			<InstitutionsPartenaires />
			<DroitsRetraite />
			<AQuoiServentMesCotisationsSection regroupement={CotisationsSection} />
		</>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . retraite': [
		'independant . cotisations et contributions . cotisations . retraite de base',
		'independant . cotisations et contributions . cotisations . retraite complémentaire',
		'independant . cotisations et contributions . cotisations . PCV',
	],
	'protection sociale . maladie': [
		'independant . cotisations et contributions . cotisations . maladie-maternité',
		'independant . cotisations et contributions . cotisations . indemnités journalières',
		'independant . cotisations et contributions . CSG-CRDS * 5.95 / 9.2',
	],
	'protection sociale . invalidité et décès': [
		'independant . cotisations et contributions . cotisations . invalidité et décès',
	],
	'protection sociale . famille': [
		'independant . cotisations et contributions . cotisations . allocations familiales',
		'independant . cotisations et contributions . CSG-CRDS * 0.95 / 9.2',
	],
	'protection sociale . autres': [
		'independant . cotisations et contributions . contributions spéciales',
		'independant . cotisations et contributions . CSG-CRDS * 2.3 / 9.2',
	],
	'protection sociale . formation': [
		'independant . cotisations et contributions . formation professionnelle',
	],
}
