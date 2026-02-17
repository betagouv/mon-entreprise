import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import dgfipSrc from '@/assets/images/logo-dgfip.svg'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { Body } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

import { InstitutionLine } from './InstitutionLine'
import { InstitutionLogo } from './InstitutionLogo'

type Props = {
	rule: DottedName
	role?: string
}

export default function ImpôtsDGFIP({ rule, role }: Props) {
	const unit = useSelector(targetUnitSelector)
	const { t } = useTranslation()

	return (
		<Condition expression={`${rule} > 0`}>
			<InstitutionLine role={role}>
				<InstitutionLogo
					href="https://www.impots.gouv.fr"
					target="_blank"
					rel="noreferrer"
					aria-label={t(
						'aria-label.dgfip',
						'DGFiP, accéder à impots.gouv.fr, nouvelle fenêtre'
					)}
				>
					<img src={dgfipSrc} alt="DGFiP" />
				</InstitutionLogo>
				<Body>
					<Trans i18nKey="simulateurs.explanation.institutions.dgfip">
						La direction générale des finances publiques (DGFiP) est l'organisme
						qui collecte l'impôt sur le revenu.{' '}
						<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
							Le montant calculé{' '}
							<strong>
								prend en compte l'abattement du régime micro-fiscal
							</strong>
							.
						</Condition>
					</Trans>
				</Body>
				<Value unit={unit} displayedUnit="€" expression={rule} />
			</InstitutionLine>
		</Condition>
	)
}
