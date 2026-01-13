import { useState } from 'react'
import {
	FieldError as RAFieldError,
	Group as RAGroup,
	Input as RAInput,
	Label as RALabel,
	NumberField as RANumberField,
	Text as RAText,
	type NumberFieldProps as RANumberFieldProps,
} from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ErrorIcon } from '@/design-system/icons'
import { Body } from '@/design-system/typography'

import { InputSuggestions, InputSuggestionsRecord } from '../../../suggestions'
import {
	errorMessageStyle,
	fieldContainerStyles,
	fieldDescriptionStyles,
	fieldInputStyles,
	fieldLabelStyles,
} from '../fieldsStyles'

type NumberFieldProps = RANumberFieldProps & {
	description?: string
	displayedUnit?: string
	errorMessage?: string
	label: string
	suggestions?: InputSuggestionsRecord<number>
	onSubmit?: (source?: string) => void
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
	suggestions,
}: NumberFieldProps) {
	const [value, setValue] = useState(defaultValue || 0)
	const { t } = useTranslation()

	return (
		<StyledRANumberField
			defaultValue={defaultValue}
			formatOptions={formatOptions}
			value={value}
			$hasError={!!errorMessage}
		>
			<StyledRALabel>{label}</StyledRALabel>

			{description && (
				<StyledDescription slot="description">{description}</StyledDescription>
			)}

			<StyledRAGroup className="input-and-unit-group">
				<StyledRAInput />

				{displayedUnit && <span>{displayedUnit}</span>}
			</StyledRAGroup>

			{errorMessage ? (
				<StyledErrorMessage slot="errorMessage">
					<ErrorIcon />
					{errorMessage}
				</StyledErrorMessage>
			) : (
				<StyledRAFieldError />
			)}

			{suggestions && (
				<StyledSuggestionsContainer>
					<Body>{t('Mettre la valeur :')}</Body>

					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(value: number) => {
							setValue(value)
						}}
					/>
				</StyledSuggestionsContainer>
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
`

const StyledRAGroup = styled(RAGroup)`
	${fieldInputStyles}

	display: flex;
	gap: ${({ theme }) => `${theme.spacings.xs}`};

	width: fit-content;
	border-radius: ${({ theme }) => theme.box.borderRadius};
`

const StyledRAInput = styled(RAInput)`
	border: none;
	outline: none;

	text-align: right;
`

const StyledDescription = styled(RAText)`
	${fieldDescriptionStyles}
`

const StyledErrorMessage = styled(RAText)`
	${fieldLabelStyles}
	${errorMessageStyle}
`

const StyledRAFieldError = styled(RAFieldError)`
	${fieldLabelStyles}
	${errorMessageStyle}
`

const StyledSuggestionsContainer = styled.div`
	display: flex;
	gap: ${({ theme }) => `${theme.spacings.xs}`};

	margin: ${({ theme }) => `${theme.spacings.xs} 0 0 0`};

	p {
		margin: 0 !important;

		font-weight: 700;
	}
`
