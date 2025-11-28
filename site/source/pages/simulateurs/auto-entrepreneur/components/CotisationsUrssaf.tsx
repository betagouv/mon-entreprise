import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import urssafSrc from '@/assets/images/Urssaf.svg'
import Value from '@/components/EngineValue/Value'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import { InstitutionLine } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLine'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLogo'
import { Body, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

type Props = {
	rule: DottedName
	extraNotice?: JSX.Element
	role?: string
}

export default function CotisationsUrssaf({
	rule,
	extraNotice,
	...props
}: Props) {
	const { t } = useTranslation()
	const unit = useSelector(targetUnitSelector)

	return (
		<InstitutionLine {...props}>
			<InstitutionLogo
				href="https://www.urssaf.fr/portail/home.html"
				target="_blank"
				rel="noreferrer"
				aria-label={t(
					'aria-label.urssaf',
					'Urssaf, accéder à urssaf.fr, nouvelle fenêtre'
				)}
			>
				<img src={urssafSrc} alt="Urssaf" />
			</InstitutionLogo>
			<div>
				<Body>
					<Trans i18nKey="pages.simulateurs.auto-entrepreneur.explications.institutions.urssaf">
						L’Urssaf recouvre les cotisations servant au financement de la
						sécurité sociale (assurance maladie, allocations familiales,
						dépendance
						<WhenNotApplicable
							dottedName={'dirigeant . indépendant . PL . CNAVPL'}
						>
							{' '}
							et retraite
						</WhenNotApplicable>
						).
					</Trans>
				</Body>
				{extraNotice && <SmallBody>{extraNotice}</SmallBody>}
			</div>
			<Value unit={unit} displayedUnit="€" expression={rule} />
		</InstitutionLine>
	)
}
