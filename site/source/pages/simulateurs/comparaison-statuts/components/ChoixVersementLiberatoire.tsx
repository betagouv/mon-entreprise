import { Key } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import { useComparateur } from '@/contextes/comparateur'
import { SmallBody, Strong } from '@/design-system'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const ChoixVersementLibératoire = () => {
	const { t } = useTranslation()
	const { situation, set } = useComparateur()

	const handleChange = (valeur: Key) => {
		set.versementLibératoire(fromOuiNon(valeur as OuiNon))
	}

	return (
		<SimulationGoalRadio
			titre={t(
				'pages.simulateurs.comparaison-statuts.montants.versement-libératoire.titre',
				'Versement libératoire (pour auto-entreprise)'
			)}
			aide={<VersementLibératoirePopoverContent />}
			// documentation={{
			// 	element: (
			// 		<LienDocumentation
			// 			id={documentationId}
			// 			dottedName={DOTTED_NAME}
			// 			aria-label={t(
			// 				'pages.simulateurs.comparaison-statuts.montants.versement-libératoire.aria-label',
			// 				'Accéder à la documentation sur le versement libératoire'
			// 			)}
			// 		/>
			// 	),
			// 	id: documentationId,
			// }}
			value={toOuiNon(situation.versementLibératoire)}
			options={[
				{
					key: 'oui',
					value: 'oui',
					label: t('global.oui', 'Oui'),
				},
				{
					key: 'non',
					value: 'non',
					label: t('global.non', 'Non'),
				},
			]}
			onChange={handleChange}
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
