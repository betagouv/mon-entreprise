import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { Body, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import * as logosSrc from '@/utils/logos'

import { InstitutionLine } from './InstitutionLine'
import { InstitutionLogo } from './InstitutionLogo'

type Props = {
	role?: string
}

export default function CaisseRetraite({ role }: Props) {
	const engine = useEngine()
	const unit = useSelector(targetUnitSelector)
	const caisses = [
		'CARCDSF',
		'CARPIMKO',
		'CIPAV',
		'CARMF',
		'CNBF',
		'CAVEC',
		'CAVP',
	] as const

	return (
		<>
			{caisses.map((caisse) => {
				const dottedName = `indépendant . PL . ${caisse}` as DottedName
				const { description, références } = engine.getRule(dottedName).rawNode

				return (
					<Condition
						expression={{
							'toutes ces conditions': [
								dottedName,
								'indépendant . PL . cotisations caisse de retraite',
							],
						}}
						key={caisse}
					>
						<InstitutionLine role={role}>
							<InstitutionLogo
								href={références && Object.values(références)[0]}
								target="_blank"
								rel="noreferrer"
							>
								<img
									src={logosSrc[caisse]}
									title={`logo ${caisse}`}
									alt={caisse}
								/>
							</InstitutionLogo>

							<Body>
								<Condition expression="indépendant . PL . CIPAV">
									{description}{' '}
									<SmallBody>
										<Trans i18nKey="simulateurs.explanation.institutions.CIPAV">
											Depuis le 1er janvier 2023, l’Urssaf recouvre les
											cotisations de retraite de base, de retraite
											complémentaire et d’invalidité-décès des professionnels
											libéraux relevant de la Cipav. La Cipav conserve la
											gestion du dossier de retraite ou de prévoyance.
										</Trans>
									</SmallBody>
								</Condition>
								<Condition expression="indépendant . PL . CIPAV = non">
									{description}{' '}
									<Trans i18nKey="simulateurs.explanation.institutions.CNAPL">
										Elle recouvre les cotisations liées à votre retraite et au
										régime d'invalidité-décès.
									</Trans>
								</Condition>
							</Body>

							<Value
								unit={unit}
								displayedUnit="€"
								expression="indépendant . PL . cotisations caisse de retraite"
							/>
						</InstitutionLine>
					</Condition>
				)
			})}
		</>
	)
}
