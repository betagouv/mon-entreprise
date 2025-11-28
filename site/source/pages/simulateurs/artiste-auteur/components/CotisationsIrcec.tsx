import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Value from '@/components/EngineValue/Value'
import { InstitutionLine } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLine'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLogo'
import { Body } from '@/design-system'
import { useEngine } from '@/hooks/useEngine'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { IRCEC } from '@/utils/logos'

type Props = {
	role?: string
}

export default function CotisationsIrcec({ role }: Props) {
	const { t } = useTranslation()
	const unit = useSelector(targetUnitSelector)
	const { description: descriptionIRCEC } = useEngine().getRule(
		'artiste-auteur . cotisations . IRCEC'
	).rawNode

	return (
		<InstitutionLine role={role}>
			<InstitutionLogo
				href="http://www.ircec.fr/"
				target="_blank"
				rel="noreferrer"
				aria-label={t(
					'aria-label.ircec',
					'Ircec, accéder à ircec.fr, nouvelle fenêtre'
				)}
			>
				<img src={IRCEC} alt="Ircec" />
			</InstitutionLogo>
			<Body>{descriptionIRCEC}</Body>
			<Value
				displayedUnit="€"
				unit={unit}
				expression="artiste-auteur . cotisations . IRCEC"
			/>
		</InstitutionLine>
	)
}
