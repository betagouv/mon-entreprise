import { useTranslation } from 'react-i18next'

import { SwitchContainer, SwitchLabel } from '@/components/Switch'
import { ChoixUnique } from '@/design-system'
import { RégularisationMethod } from '@/pages/simulateurs/lodeom/utils'

type Props = {
	régularisationMethod: RégularisationMethod
	setRégularisationMethod: (value: RégularisationMethod) => void
}

export default function RégularisationSwitch({
	régularisationMethod,
	setRégularisationMethod,
}: Props) {
	const { t } = useTranslation()

	const options = [
		{
			value: 'annuelle',
			label: t(
				'pages.simulateurs.lodeom.régularisation.annuelle',
				'Régularisation annuelle'
			),
		},
		{
			value: 'progressive',
			label: t(
				'pages.simulateurs.lodeom.régularisation.progressive',
				'Régularisation progressive'
			),
		},
	]

	return (
		<SwitchContainer>
			<SwitchLabel id="régularisation-switch-label" as="label">
				{t(
					'pages.simulateurs.lodeom.régularisation.type',
					'Quel type de régularisation souhaitez-vous ?'
				)}
			</SwitchLabel>

			<ChoixUnique
				variant="toggle"
				options={options}
				value={régularisationMethod}
				onChange={(value) => {
					setRégularisationMethod(value as RégularisationMethod)
				}}
				aria={{ labelledby: 'régularisation-switch-label' }}
			/>
		</SwitchContainer>
	)
}
