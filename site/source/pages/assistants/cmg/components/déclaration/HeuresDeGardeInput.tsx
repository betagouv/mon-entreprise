import { useTranslation } from 'react-i18next'

import { NumberField } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

type Props = {
	idSuffix?: string
	valeur: number
	onChange: ChangeHandler<number | undefined>
}

export default function HeuresDeGardeInput({
	idSuffix,
	valeur,
	onChange,
}: Props) {
	const { t } = useTranslation()

	return (
		<div>
			<Label id={`heures-de-garde-label-${idSuffix}`}>
				{t('pages.assistants.cmg.GED.heures-de-garde.label', 'Heures de garde')}
			</Label>
			<NumberField
				value={valeur}
				onChange={onChange}
				aria-labelledby={`heures-de-garde-label-${idSuffix}`}
			/>
		</div>
	)
}
