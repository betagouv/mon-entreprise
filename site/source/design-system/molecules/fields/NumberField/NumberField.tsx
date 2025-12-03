import {
	FieldError as RAFieldError,
	Group as RAGroup,
	Input as RAInput,
	Label as RALabel,
	NumberField as RANumberField,
	Text as RAText,
	type NumberFieldProps as RANumberFieldProps,
} from 'react-aria-components'
import { styled } from 'styled-components'

import {
	errorColorStyle,
	fieldContainerStyles,
	fieldInputStyles,
	fieldLabelStyles,
	labelAndInputContainerStyles,
} from '../fieldsStyles'

type NumberFieldProps = RANumberFieldProps & {
	description?: string
	displayedUnit?: string
	errorMessage?: string
	label: string
}

export function NumberField({
	defaultValue,
	description,
	displayedUnit,
	errorMessage,
	formatOptions = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	},
	label,
}: NumberFieldProps) {
	return (
		<StyledRANumberField
			defaultValue={defaultValue}
			formatOptions={formatOptions}
			$hasError={!!errorMessage}
		>
			<StyledRALabel>{label}</StyledRALabel>

			{description && (
				<StyledRAText slot="description">{description}</StyledRAText>
			)}

			<StyledRAGroup className="input-and-unit-group">
				<StyledRAInput />

				{displayedUnit && <span>{displayedUnit}</span>}
			</StyledRAGroup>

			{errorMessage ? (
				<StyledErrorMessage slot="errorMessage">
					{errorMessage}
				</StyledErrorMessage>
			) : (
				<StyledRAFieldError />
			)}
		</StyledRANumberField>
	)
}

const StyledRANumberField = styled(RANumberField)<{
	$hasError: boolean
}>`
	${fieldContainerStyles}

	${({ theme, $hasError }) =>
		$hasError &&
		`label {
            color: ${theme.colors.extended.error[400]}
        }

		.input-and-unit-group {
			border-color: ${theme.colors.extended.error[400]};
		}
        `}
`

const StyledRALabel = styled(RALabel)`
	${fieldLabelStyles}

	padding-left: 0;
`

const StyledRAGroup = styled(RAGroup)`
	${labelAndInputContainerStyles}

	flex-direction: row;

	width: fit-content;
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm}`};
`

const StyledRAInput = styled(RAInput)`
	${fieldInputStyles}

	margin: 0;

	text-align: right;
`

const StyledRAText = styled(RAText)`
	${fieldLabelStyles}

	padding-top: 0;
	padding-left: 0;
`

const StyledErrorMessage = styled(RAText)`
	${fieldLabelStyles}
	${errorColorStyle}

	padding-left: 0;
`

const StyledRAFieldError = styled(RAFieldError)`
	${fieldLabelStyles}
	${errorColorStyle}

	padding-left: 0;
`
