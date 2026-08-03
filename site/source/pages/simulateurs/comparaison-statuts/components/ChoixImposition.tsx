import { Key } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import { IRouIS, useComparateur } from '@/contextes/comparateur'
import { Message, SmallBody, Strong } from '@/design-system'

export const ChoixImposition = () => {
	const { t } = useTranslation()
	const { situation, set } = useComparateur()

	const handleChange = (valeur: Key) => {
		set.IRouIS(valeur as IRouIS)
	}

	return (
		<SimulationGoalRadio
			titre={t(
				'pages.simulateurs.comparaison-statuts.montants.imposition.titre',
				'Mode d’imposition (hors auto-entreprise)'
			)}
			aide={<ImpositionPopoverContent />}
			// documentation={{
			// 	element: (
			// 		<LienDocumentation
			// 			id={documentationId}
			// 			dottedName={DOTTED_NAME}
			// 			aria-label={t(
			// 				'pages.simulateurs.comparaison-statuts.montants.imposition.aria-label',
			// 				"Accéder à la documentation sur le mode d'imposition"
			// 			)}
			// 		/>
			// 	),
			// 	id: documentationId,
			// }}
			value={situation.IRouIS}
			options={[
				{
					key: 'IR',
					value: 'IR',
					label: t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.IR',
						'Impôt sur le revenu'
					),
				},
				{
					key: 'IS',
					value: 'IS',
					label: t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.IS',
						'Impôt sur les sociétés'
					),
				},
			]}
			onChange={handleChange}
		/>
	)
}

const ImpositionPopoverContent = () => {
	const { t } = useTranslation()

	return (
		<div>
			<SmallBodyWithoutTopMargin>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.montants.imposition.info-bulle">
					Vous pouvez{' '}
					<Strong>
						choisir entre l’imposition sur les sociétés et sur le revenu
					</Strong>{' '}
					durant les 5 premières années.
				</Trans>
			</SmallBodyWithoutTopMargin>

			<StyledMessage type="info" icon mini>
				<SmallBodyWithoutMargin>
					{t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.disclaimer',
						'À ce jour, ce comparateur ne prend pas en compte le calcul de l’impôt sur le revenu pour les SAS(U).'
					)}
				</SmallBodyWithoutMargin>
			</StyledMessage>
		</div>
	)
}

const StyledMessage = styled(Message)`
	margin: 0;
	padding: ${({ theme }) => theme.spacings.sm};
`

const SmallBodyWithoutTopMargin = styled(SmallBody)`
	margin-top: 0;
	margin-bottom: ${({ theme }) => theme.spacings.xs};
`

const SmallBodyWithoutMargin = styled(SmallBody)`
	margin: 0;
`
