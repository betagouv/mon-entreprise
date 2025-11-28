import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import urssafSrc from '@/assets/images/Urssaf.svg'
import Value from '@/components/EngineValue/Value'
import { Body, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

import { InstitutionLine } from './InstitutionLine'
import { InstitutionLogo } from './InstitutionLogo'

type Props = {
	rule: DottedName
	extraNotice?: JSX.Element
	role?: string
	children: ReactNode
}

export default function CotisationsUrssaf({
	rule,
	extraNotice,
	role,
	children,
}: Props) {
	const unit = useSelector(targetUnitSelector)
	const { t } = useTranslation()

	return (
		<InstitutionLine role={role}>
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
				<Body>{children}</Body>
				{extraNotice && <SmallBody>{extraNotice}</SmallBody>}
			</div>
			<Value unit={unit} displayedUnit="€" expression={rule} />
		</InstitutionLine>
	)
}
