import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import assuranceMaladieSrc from '@/assets/images/assurance-maladie.svg'
import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { InstitutionLine } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLine'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLogo'
import { Body, Emoji } from '@/design-system'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

type Props = {
	role?: string
}

export default function ParticipationCPAM({ role }: Props) {
	const { t } = useTranslation()
	const unit = useSelector(targetUnitSelector)

	return (
		<InstitutionLine role={role}>
			<InstitutionLogo
				href="https://www.ameli.fr/assure/droits-demarches/salaries-travailleurs-independants-et-personnes-sans-emploi/emploi-independant-non-salarie/praticien-auxiliaire-medical"
				target="_blank"
				rel="noreferrer"
				aria-label={t(
					'aria-label.cpam',
					'CPAM, accéder à ameli.fr, nouvelle fenêtre'
				)}
			>
				<img src={assuranceMaladieSrc} alt="CPAM" />
			</InstitutionLogo>
			<Body>
				{t(
					'pages.simulateurs.indépendant.explications.institutions.cpam',
					'En tant que professionnel de santé conventionné, vous bénéficiez d’une prise en charge d’une partie de vos cotisations par l’Assurance Maladie.'
				)}
			</Body>
			<Body>
				<Emoji emoji="🎁" />{' '}
				<RuleLink dottedName="indépendant . profession libérale . réglementée . PAMC . participation CPAM">
					<Value
						unit={unit}
						displayedUnit="€"
						expression="- indépendant . profession libérale . réglementée . PAMC . participation CPAM"
					/>
				</RuleLink>
			</Body>
		</InstitutionLine>
	)
}
