import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import RuleLink from '@/components/RuleLink'
import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import { SmallBody, Strong } from '@/design-system'
import { OuiNon } from '@/domaine/OuiNon'
import { useStatefulRulesEdit } from '@/hooks/useStatefulRulesEdit'

const DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE =
	'dirigeant . auto-entrepreneur . impôt . versement libératoire'

export const ChoixVersementLibératoire = () => {
	const { t } = useTranslation()
	const { set, values } = useStatefulRulesEdit(
		[DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE] as const,
		{ 'dirigeant . auto-entrepreneur': 'oui' }
	)

	return (
		<SimulationGoalRadio
			titre={
				<RuleLink
					dottedName={DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE}
				>
					{t(
						'pages.simulateurs.comparaison-statuts.montants.versement-libératoire.titre',
						'Versement libératoire (pour auto-entreprise)'
					)}
				</RuleLink>
			}
			aide={<VersementLibératoirePopoverContent />}
			value={
				values[DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE] as
					| string
					| undefined
			}
			options={[
				{
					key: 'oui',
					value: 'oui',
					label: t('global.oui-non.oui', 'Oui'),
				},
				{
					key: 'non',
					value: 'non',
					label: t('global.oui-non.non', 'Non'),
				},
			]}
			onChange={(value) => {
				set[DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE](value as OuiNon)
			}}
		/>
	)
}

const VersementLibératoirePopoverContent = () => (
	<SmallBodyWithoutMargin>
		<Trans i18nKey="pages.simulateurs.comparaison-statuts.montants.versement-libératoire.info-bulle">
			En tant qu’auto-entreprise, c’est l’
			<Strong>impôt sur le revenu</Strong> qui est appliqué automatiquement.
			Dans certaines situations, vous pouvez opter pour le{' '}
			<Strong>versement libératoire</Strong>.
		</Trans>
	</SmallBodyWithoutMargin>
)

const SmallBodyWithoutMargin = styled(SmallBody)`
	margin: 0;
`
