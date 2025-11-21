import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import urssafSrc from '@/assets/images/Urssaf.svg'
import Value from '@/components/EngineValue/Value'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import { InstitutionLine } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLine'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLogo'
import { Body } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

type Props = {
	rule: DottedName
	role?: string
}

export default function CotisationsUrssaf({ rule, role }: Props) {
	const unit = useSelector(targetUnitSelector)

	return (
		<InstitutionLine role={role}>
			<InstitutionLogo
				href="https://www.urssaf.fr/portail/home.html"
				target="_blank"
				rel="noreferrer"
				aria-label="Logo URSSAF, accéder à urssaf.fr, nouvelle fenêtre"
			>
				<img src={urssafSrc} alt="Logo Urssaf" />
			</InstitutionLogo>
			<div>
				<Body>
					<Trans i18nKey="pages.simulateurs.indépendant.explications.institutions.urssaf">
						L’Urssaf recouvre les cotisations servant au financement de la
						sécurité sociale (assurance maladie, allocations familiales,
						dépendance
						<WhenNotApplicable dottedName={'indépendant . PL . CNAVPL'}>
							{' '}
							et retraite
						</WhenNotApplicable>
						).
					</Trans>
				</Body>
			</div>
			<Value unit={unit} displayedUnit="€" expression={rule} />
		</InstitutionLine>
	)
}
