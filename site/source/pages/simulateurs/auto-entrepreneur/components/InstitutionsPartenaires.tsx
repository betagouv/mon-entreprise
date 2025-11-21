import ImpôtsDGFIP from '@/components/simulationExplanation/InstitutionsPartenaires/ImpôtsDGFIP'
import InstitutionsPartenaires from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionsPartenaires'

import CotisationsUrssaf from './CotisationsUrssaf'

export default function InstitutionsPartenairesAutoEntrepreneur() {
	return (
		<InstitutionsPartenaires role="list">
			<CotisationsUrssaf
				rule="dirigeant . auto-entrepreneur . cotisations et contributions"
				role="listitem"
			/>
			<ImpôtsDGFIP role="listitem" />
		</InstitutionsPartenaires>
	)
}
