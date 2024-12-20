import { useTranslation } from 'react-i18next'

import { Radio, ToggleGroup } from '@/design-system'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

type Props = {
	régularisationMethod: RégularisationMethod
	setRégularisationMethod: (value: RégularisationMethod) => void
}

export default function RégularisationSwitch({
	régularisationMethod,
	setRégularisationMethod,
}: Props) {
	const { t } = useTranslation()

	return (
		<ToggleGroup
			value={régularisationMethod}
			onChange={(value) => {
				setRégularisationMethod(value as RégularisationMethod)
			}}
			aria-label={t(
				'pages.simulateurs.réduction-générale.régularisation.type',
				'Type de régularisation'
			)}
		>
			<Radio value="annuelle">
				{t(
					'pages.simulateurs.réduction-générale.régularisation.annuelle',
					'Régularisation annuelle'
				)}
			</Radio>
			<Radio value="progressive">
				{t(
					'pages.simulateurs.réduction-générale.régularisation.progressive',
					'Régularisation progressive'
				)}
			</Radio>
		</ToggleGroup>
	)
}
