import { TextField } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

interface TextInputProps {
	id?: string
	value: ValeurPublicodes | undefined
	onChange?: (value: ValeurPublicodes | undefined) => void
	title?: string
	description?: string
	onSubmit?: (source?: string) => void

	aria?: {
		labelledby?: string
		describedby?: string
	}
}

export default function TextInput({
	id,
	onChange = NoOp,
	value,
	description,
	title,
	aria,
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
			onChange={(value) => {
				handleChange(value)
			}}
			description={description}
			defaultValue={(value as string) || ''}
			autoComplete="off"
			aria-labelledby={aria?.labelledby}
			aria-describedby={aria?.describedby}
		/>
	)
}
