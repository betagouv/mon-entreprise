import { TextField } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

interface TextInputProps {
	id: string
	value: ValeurPublicodes | undefined
	onChange?: (value: ValeurPublicodes | undefined) => void
	missing?: boolean
	title?: string
	description?: string
	autoFocus?: boolean
	onSubmit?: (source?: string) => void

	aria?: {
		labelledby?: string
		label?: string
	}
}

export default function TextInput({
	id,
	onChange = NoOp,
	value,
	description,
	title,
	missing,
	autoFocus,
	aria = {},
}: TextInputProps) {
	const { handleChange } = useSelection({
		value,
		onChange,
	})

	return (
		<TextField
			id={id}
			type="text"
			label={title}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
			onChange={(value) => {
				handleChange(value)
			}}
			description={description}
			{...{
				[missing ? 'placeholder' : 'defaultValue']: (value as string) || '',
			}}
			autoComplete="off"
			aria-label={aria.label ?? title}
			aria-labelledby={aria.labelledby}
		/>
	)
}
