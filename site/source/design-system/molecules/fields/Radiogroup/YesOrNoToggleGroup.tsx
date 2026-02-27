import { RadioGroupProps as RARadioGroupProps } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import { OuiNon } from '@/domaine/OuiNon'

import { ToggleGroup } from './ToggleGroup'

type YesOrNoToggleGroupProps = Pick<RARadioGroupProps, 'onChange'> & {
	defaultValue?: OuiNon
	legend: string
	value?: OuiNon
}

export function YesOrNoToggleGroup({
	defaultValue,
	legend,
	value,
	onChange,
}: YesOrNoToggleGroupProps) {
	const { t } = useTranslation()

	return (
		<ToggleGroup
			defaultValue={defaultValue}
			legend={legend}
			options={[
				{ label: t('conversation.yes', 'Oui'), value: 'oui' },
				{ label: t('conversation.no', 'Non'), value: 'non' },
			]}
			value={value}
			onChange={onChange}
		/>
	)
}
