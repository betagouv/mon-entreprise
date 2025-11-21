import { ÀQuoiServentMesCotisationsSection } from '@/components/simulationExplanation/ÀQuoiServentMesCotisations/ÀQuoiServentMesCotisationsSection'
import { DottedName } from '@/domaine/publicodes/DottedName'
import DroitsRetraite from '@/pages/simulateurs/auto-entrepreneur/components/DroitsRetraite'

import InstitutionsPartenaires from './InstitutionsPartenaires'
import RépartitionRevenu from './RépartitionRevenu'

export default function Explications() {
	return (
		<>
			<RépartitionRevenu />
			<InstitutionsPartenaires />
			<DroitsRetraite />
			<ÀQuoiServentMesCotisationsSection regroupement={CotisationsSection} />
		</>
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
	'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . formation professionnelle':
		[
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . formation professionnelle',
		],
}
