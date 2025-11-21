import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import assuranceMaladieSrc from '@/assets/images/assurance-maladie.svg'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import RuleLink from '@/components/RuleLink'
import CaisseRetraite from '@/components/simulationExplanation/InstitutionsPartenaires/CaisseRetraite'
import ImpôtsDGFIP from '@/components/simulationExplanation/InstitutionsPartenaires/ImpôtsDGFIP'
import { InstitutionLine } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLine'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionLogo'
import InstitutionsPartenaires from '@/components/simulationExplanation/InstitutionsPartenaires/InstitutionsPartenaires'
import { Body, Emoji } from '@/design-system'
import CotisationsUrssaf from '@/pages/simulateurs/indépendant/components/CotisationsUrssaf'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

export default function InstitutionsPartenairesIndépendant() {
	const unit = useSelector(targetUnitSelector)
	const { t } = useTranslation()

	return (
		<InstitutionsPartenaires role="list">
			<WhenApplicable dottedName="indépendant . PL . CNAVPL">
				<CotisationsUrssaf
					rule="indépendant . cotisations et contributions . Urssaf"
					role="listitem"
				/>
				<CaisseRetraite role="listitem" />
			</WhenApplicable>
			<WhenNotApplicable dottedName="indépendant . PL . CNAVPL">
				<CotisationsUrssaf
					rule="indépendant . cotisations et contributions . Urssaf"
					role="listitem"
				/>
			</WhenNotApplicable>
			<ImpôtsDGFIP role="listitem" />
			<Condition expression="indépendant . PL . PAMC . participation CPAM > 0">
				<InstitutionLine role="listitem">
					<InstitutionLogo
						href="https://www.ameli.fr/assure/droits-demarches/salaries-travailleurs-independants-et-personnes-sans-emploi/emploi-independant-non-salarie/praticien-auxiliaire-medical"
						target="_blank"
						rel="noreferrer"
						aria-label="Logo CPAM, accéder à ameli.fr, nouvelle fenêtre"
					>
						<img src={assuranceMaladieSrc} alt="Logo CPAM" />
					</InstitutionLogo>
					<Body>
						{t(
							'pages.simulateurs.indépendant.explications.institutions.cpam',
							'En tant que professionnel de santé conventionné, vous bénéficiez d’une prise en charge d’une partie de vos cotisations par l’Assurance Maladie.'
						)}
					</Body>
					<Body>
						<Emoji emoji="🎁" />{' '}
						<RuleLink dottedName="indépendant . PL . PAMC . participation CPAM">
							<Value
								unit={unit}
								displayedUnit="€"
								expression="- indépendant . PL . PAMC . participation CPAM"
							/>
						</RuleLink>
					</Body>
				</InstitutionLine>
			</Condition>
		</InstitutionsPartenaires>
	)
}
