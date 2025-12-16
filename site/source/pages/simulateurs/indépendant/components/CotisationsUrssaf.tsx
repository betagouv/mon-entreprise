import { Trans } from 'react-i18next'

import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import CotisationsUrssaf from '@/components/simulationExplanation/InstitutionsPartenaires/CotisationsUrssaf'

type Props = {
	role?: string
}

export default function CotisationsUrssafIndépendant({ role }: Props) {
	return (
		<CotisationsUrssaf
			rule="indépendant . cotisations et contributions . Urssaf"
			role={role}
		>
			<Trans i18nKey="pages.simulateurs.indépendant.explications.institutions.urssaf">
				L’Urssaf recouvre les cotisations servant au financement de la sécurité
				sociale (assurance maladie, allocations familiales, dépendance
				<WhenNotApplicable
					dottedName={'indépendant . profession libérale . CNAVPL'}
				>
					{' '}
					et retraite
				</WhenNotApplicable>
				).
			</Trans>
		</CotisationsUrssaf>
	)
}
