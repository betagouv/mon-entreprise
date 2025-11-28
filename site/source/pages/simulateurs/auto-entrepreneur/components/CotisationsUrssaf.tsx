import { Trans } from 'react-i18next'

import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import CotisationsUrssaf from '@/components/simulationExplanation/InstitutionsPartenaires/CotisationsUrssaf'

type Props = {
	role?: string
}

export default function CotisationsUrssafAutoEntrepreneur({ role }: Props) {
	return (
		<CotisationsUrssaf
			rule="dirigeant . auto-entrepreneur . cotisations et contributions"
			role={role}
		>
			<Trans i18nKey="pages.simulateurs.auto-entrepreneur.explications.institutions.urssaf">
				L’Urssaf recouvre les cotisations servant au financement de la sécurité
				sociale (assurance maladie, allocations familiales, dépendance
				<WhenNotApplicable dottedName={'dirigeant . indépendant . PL . CNAVPL'}>
					{' '}
					et retraite
				</WhenNotApplicable>
				).
			</Trans>
		</CotisationsUrssaf>
	)
}
