import {
	FieldError as RAFieldError,
	Input as RAInput,
	Label as RALabel,
	Text as RAText,
	TextField as RATextField,
	type TextFieldProps as RATextFieldProps,
} from 'react-aria-components'

type TextFieldProps = RATextFieldProps & {
	description?: string
	errorMessage?: string
	label: string
	placeholder?: string
}

export function TextField({
	defaultValue,
	description,
	errorMessage,
	placeholder,
	label,
}: TextFieldProps) {
	return (
		<RATextField defaultValue={defaultValue}>
			<RALabel>{label}</RALabel>

			<RAInput placeholder={placeholder} />

			{description && <RAText slot="description">{description}</RAText>}

			{errorMessage ? (
				<RAText slot="errorMessage">{errorMessage}</RAText>
			) : (
				<RAFieldError />
			)}
		</RATextField>
	)
}
