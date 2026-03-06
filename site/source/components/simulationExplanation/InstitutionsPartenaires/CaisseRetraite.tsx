import { formatValue } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { Body, SmallBody } from '@/design-system'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import * as logosSrc from '@/utils/logos'

import { InstitutionLine } from './InstitutionLine'
import { InstitutionLogo } from './InstitutionLogo'

type Props = {
	role?: string
}

export default function CaisseRetraite({ role }: Props) {
	const { t, i18n } = useTranslation()
	const unit = useSelector(targetUnitSelector)
	const caisses = {
		CARCDSF: {
			description: t(
				'simulateurs.explanation.institutions.CARCDSF.description',
				'La CARCDSF est la caisse de retraite des chirurgiennes et chirurgiens dentistes et des sages-femmes.'
			),
			site: 'https://www.carcdsf.fr',
		},
		CARPIMKO: {
			description: t(
				'simulateurs.explanation.institutions.CARPIMKO.description',
				'La CARPIMKO est la caisse de retraite autonome des auxiliaires médicales/médicaux.'
			),
			site: 'https://www.carpimko.com',
		},
		CARMF: {
			description: t(
				'simulateurs.explanation.institutions.CARMF.description',
				'La CARMF est la caisse de retraite autonome des médecins de France.'
			),
			site: 'https://www.carmf.fr',
		},
		CNBF: {
			description: t(
				'simulateurs.explanation.institutions.CNBF.description',
				'La Caisse Nationale des Barreaux Français (CNBF) est l’organisme de sécurité sociale des avocates et avocats.'
			),
			site: 'https://www.cnbf.fr',
		},
		CAVEC: {
			description: t(
				'simulateurs.explanation.institutions.CAVEC.description',
				'La CAVEC est l’organisme de sécurité sociale des experts-comptables et des commissaires aux comptes.'
			),
			site: 'https://www.cavec.fr',
		},
		CAVP: {
			description: t(
				'simulateurs.explanation.institutions.CAVP.description',
				'La CAVP est la caisse de retraite des pharmaciennes et pharmaciens.'
			),
			site: 'https://www.cavp.fr',
		},
	} as const

	const CipavValue = formatValue(0, {
		language: i18n.language,
		displayedUnit: '€',
	}) as string

	return (
		<>
			{Object.keys(caisses).map((caisse) => {
				const { description, site } = caisses[caisse as keyof typeof caisses]

				return (
					<Condition
						expression={`indépendant . profession libérale . réglementée . ${caisse}`}
						key={caisse}
					>
						<InstitutionLine role={role}>
							<InstitutionLogo href={site} target="_blank" rel="noreferrer">
								<img
									src={logosSrc[caisse as keyof typeof logosSrc]}
									alt={t(
										'simulateurs.explanation.institutions.CNAVPL.img',
										'Site de la {{ caisse }}, nouvelle fenêtre',
										{ caisse }
									)}
								/>
							</InstitutionLogo>

							<Body>
								{description}{' '}
								<Trans i18nKey="simulateurs.explanation.institutions.CNAVPL.note">
									Elle recouvre les cotisations liées à votre retraite et au
									régime d'invalidité-décès.
								</Trans>
							</Body>

							<Value
								unit={unit}
								displayedUnit="€"
								expression="indépendant . profession libérale . cotisations caisse de retraite"
							/>
						</InstitutionLine>
					</Condition>
				)
			})}
			<Condition expression="indépendant . profession libérale . Cipav">
				<InstitutionLine role={role}>
					<InstitutionLogo
						href="https://www.lacipav.fr"
						target="_blank"
						rel="noreferrer"
					>
						<img
							src={logosSrc.CIPAV}
							alt={t(
								'simulateurs.explanation.institutions.CIPAV.img',
								'Site de la Cipav, nouvelle fenêtre'
							)}
						/>
					</InstitutionLogo>

					<Body>
						{t(
							'simulateurs.explanation.institutions.CIPAV.description',
							'La Cipav est la caisse de retraite autonomes des professions libérales réglementées.'
						)}
						<SmallBody>
							<Trans i18nKey="simulateurs.explanation.institutions.CIPAV.note">
								Depuis le 1er janvier 2023, l’Urssaf recouvre les cotisations de
								retraite de base, de retraite complémentaire et
								d’invalidité-décès des professionnels libéraux relevant de la
								Cipav. La Cipav conserve la gestion du dossier de retraite ou de
								prévoyance.
							</Trans>
						</SmallBody>
					</Body>

					<StyledValue>{CipavValue}</StyledValue>
				</InstitutionLine>
			</Condition>
		</>
	)
}

const StyledValue = styled.span`
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
`
