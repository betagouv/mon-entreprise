import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { TextField } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

type Props = {
	idSuffix?: string
	valeur: O.Option<string>
	onChange: ChangeHandler<O.Option<string>>
}

export default function PrénomInput({ idSuffix, valeur, onChange }: Props) {
	const { t } = useTranslation()

	return (
		<div>
			<Label id={`prénom-label-${idSuffix}`}>
				{t('pages.assistants.cmg.enfants.prénom.label', 'Prénom')}
			</Label>
			<StyledTextField
				value={O.getOrUndefined(valeur)}
				onChange={(valeur) => onChange(O.fromNullable(valeur))}
				aria-labelledby={`prénom-label-${idSuffix}`}
			/>
		</div>
	)
}

const StyledTextField = styled(TextField)``
