import {
	FieldError as RAFieldError,
	Input as RAInput,
	Label as RALabel,
	Text as RAText,
	TextField as RATextField,
	type TextFieldProps as RATextFieldProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import {
	errorColorStyle,
	fieldContainerStyles,
	fieldInputStyles,
	fieldLabelStyles,
	labelAndInputContainerStyles,
} from '../fieldsStyles'

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
	type = 'text',
}: TextFieldProps) {
	return (
		<StyledRATextField type={type} defaultValue={defaultValue}>
			<StyledLabelAndInputContainer $hasError={!!errorMessage}>
				<StyledRALabel>{label}</StyledRALabel>

				<StyledRAInput placeholder={placeholder} />
			</StyledLabelAndInputContainer>

			{description && (
				<StyledRAText slot="description">{description}</StyledRAText>
			)}

			{errorMessage ? (
				<StyledErrorMessage slot="errorMessage">
					{errorMessage}
				</StyledErrorMessage>
			) : (
				<StyledRAFieldError />
			)}
		</StyledRATextField>
	)
}

const StyledRATextField = styled(RATextField)`
	${fieldContainerStyles}
`

const StyledLabelAndInputContainer = styled.div<{
	$hasError: boolean
}>`
	${labelAndInputContainerStyles}

	${({ theme, $hasError }) =>
		$hasError &&
		`border-color: ${theme.colors.extended.error[400]};

        label {
            color: ${theme.colors.extended.error[400]}
        }
        `}
`

const StyledRALabel = styled(RALabel)`
	${fieldLabelStyles}
`

const StyledRAInput = styled(RAInput)`
	${fieldInputStyles}
`

const StyledRAText = styled(RAText)`
	${fieldLabelStyles}
`

const StyledErrorMessage = styled(RAText)`
	${fieldLabelStyles}
	${errorColorStyle}
`

const StyledRAFieldError = styled(RAFieldError)`
	${fieldLabelStyles}
	${errorColorStyle}
`
