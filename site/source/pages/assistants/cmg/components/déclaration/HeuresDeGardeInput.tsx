import { useTranslation } from 'react-i18next'

import { Body, NumberField } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

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
		<>
			<Body id={`heures-de-garde-label-${idSuffix}`}>
				{t('pages.assistants.cmg.GED.heures-de-garde.label', 'Heures de garde')}
			</Body>
			<NumberField
				value={valeur}
				onChange={onChange}
				aria-labelledby={`heures-de-garde-label-${idSuffix}`}
			/>
		</>
	)
}
