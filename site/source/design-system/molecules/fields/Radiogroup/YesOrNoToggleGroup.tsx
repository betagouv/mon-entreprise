import { RadioGroupProps as RARadioGroupProps } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import { OuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { ToggleGroup } from './ToggleGroup'

type YesOrNoToggleGroupProps = Pick<RARadioGroupProps, 'onChange'> & {
	defaultValue?: OuiNon
	legend: string
	ruleToExplain?: DottedName
	value?: OuiNon
}

export function YesOrNoToggleGroup({
	defaultValue,
	legend,
	ruleToExplain,
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
			ruleToExplain={ruleToExplain}
			value={value}
			onChange={onChange}
		/>
	)
}
