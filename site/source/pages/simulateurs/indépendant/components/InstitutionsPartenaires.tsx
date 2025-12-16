import { Condition } from '@/components/EngineValue/Condition'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import CaisseRetraite from '@/components/simulationExplanation/InstitutionsPartenaires/CaisseRetraite'
import ImpôtsDGFIP from '@/components/simulationExplanation/InstitutionsPartenaires/ImpôtsDGFIP'
import InstitutionsPartenaires from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionsPartenaires'
import CotisationsUrssaf from '@/pages/simulateurs/indépendant/components/CotisationsUrssaf'

import ParticipationCPAM from './ParticipationCPAM'

export default function InstitutionsPartenairesIndépendant() {
	return (
		<InstitutionsPartenaires role="list">
			<WhenApplicable dottedName="indépendant . profession libérale . CNAVPL">
				<CotisationsUrssaf role="listitem" />
				<CaisseRetraite role="listitem" />
			</WhenApplicable>
			<WhenNotApplicable dottedName="indépendant . profession libérale . CNAVPL">
				<CotisationsUrssaf role="listitem" />
			</WhenNotApplicable>
			<ImpôtsDGFIP role="listitem" rule="indépendant . rémunération . impôt" />
			<Condition expression="indépendant . profession libérale . réglementée . PAMC . participation CPAM > 0">
				<ParticipationCPAM role="listitem" />
			</Condition>
		</InstitutionsPartenaires>
	)
}
