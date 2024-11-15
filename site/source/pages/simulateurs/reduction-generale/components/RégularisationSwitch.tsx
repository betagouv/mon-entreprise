import { useTranslation } from 'react-i18next'

import { Radio, ToggleGroup } from '@/design-system'

import { RégularisationMethod } from '../utils'

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
			aria-label={t('Type de régularisation')}
		>
			<Radio value="annuelle">{t('Régularisation annuelle')}</Radio>
			<Radio value="progressive">{t('Régularisation progressive')}</Radio>
		</ToggleGroup>
	)
}
