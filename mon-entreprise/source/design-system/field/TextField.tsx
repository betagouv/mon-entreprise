import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield'
import { ExtraSmallBody } from 'DesignSystem/typography/paragraphs'
import { InputHTMLAttributes, useRef } from 'react'
import styled, { css } from 'styled-components'

const LABEL_HEIGHT = '1rem'

export default function TextField(props: AriaTextFieldOptions) {
	const ref = useRef<HTMLInputElement>(null)
	const { labelProps, inputProps, descriptionProps, errorMessageProps } =
		useTextField({ ...props, inputElementType: 'input' }, ref)

	return (
		<StyledContainer>
			<StyledInputContainer
				hasError={!!props.errorMessage || props.validationState === 'invalid'}
				hasLabel={!!props.label}
			>
				<StyledInput
					{...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
					placeholder={inputProps.placeholder ?? ''}
					ref={ref}
				/>
				{props.label && (
					<StyledLabel {...labelProps}>{props.label}</StyledLabel>
				)}
			</StyledInputContainer>
			{props.errorMessage && (
				<StyledErrorMessage {...errorMessageProps}>
					{props.errorMessage}
				</StyledErrorMessage>
			)}
			{props.description && (
				<StyledDescription {...descriptionProps}>
					{props.description}
				</StyledDescription>
			)}
		</StyledContainer>
	)
}

export const StyledContainer = styled.div`
	min-width: fit-content;
`
export const StyledInput = styled.input`
	font-size: 1rem;
	line-height: 1.5rem;
	flex: 1;
	border: none;
	background: none;
	font-family: ${({ theme }) => theme.fonts.main};
	height: 100%;
	outline: none;
	transition: color 0.2s;
	${({ theme }) =>
		theme.darkMode &&
		css`
			color: ${theme.colors.extended.grey[100]} !important;
		`}
`

export const StyledLabel = styled.label`
	top: 0%;
	left: 0;
	pointer-events: none;
	transform: translateY(0%);
	font-size: 0.75rem;
	line-height: ${LABEL_HEIGHT};
	font-family: ${({ theme }) => theme.fonts.main};
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.sm}`};
	position: absolute;
	will-change: transform top font-size line-height color;
	transition: all 0.1s;
	${({ theme }) =>
		theme.darkMode &&
		css`
			color: ${theme.colors.extended.grey[100]} !important;
		`}
`

export const StyledDescription = styled(ExtraSmallBody)`
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.sm}`};
	will-change: color;
	transition: color 0.2s;
`

export const StyledErrorMessage = styled(StyledDescription)`
	color: ${({ theme }) => theme.colors.extended.error[400]} !important;
`

export const StyledSuffix = styled.span`
	font-size: 1rem;
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
`

export const StyledInputContainer = styled.div<{
	hasError: boolean
	hasLabel: boolean
}>`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) =>
		`${theme.box.borderWidth} solid ${
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[500]
		}`};
	outline: transparent solid 1px;
	position: relative;
	display: flex;
	background-color: ${({ theme }) =>
		theme.darkMode ? 'transparent' : theme.colors.extended.grey[100]};
	align-items: center;
	transition: all 0.2s;

	:focus-within {
		${({ theme }) =>
			theme.darkMode &&
			css`
				background-color: rgba(255, 255, 255, 20%);
			`}
		outline-color: ${({ theme, hasError }) =>
			hasError
				? theme.colors.extended.error[400]
				: theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[600]};
	}
	:focus-within ${StyledLabel} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	:focus-within + ${StyledDescription} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	${({ hasLabel }) =>
		hasLabel &&
		css`
			${StyledInput}:not(:focus):placeholder-shown {
				color: transparent;
			}
			${StyledInput}:not(:focus):placeholder-shown + ${StyledSuffix} {
				color: transparent;
			}
		`}

	${StyledInput}:not(:focus):placeholder-shown + ${StyledLabel} {
		font-size: 1rem;
		line-height: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	${({ theme, hasError }) =>
		hasError &&
		css`
			&& {
				border-color: ${theme.colors.extended.error[400]};
			}
			&&& label {
				color: ${theme.colors.extended.error[400]};
			}
		`}

	${StyledInput}, ${StyledSuffix} {
		padding: ${({ hasLabel, theme }) =>
				css`calc(${hasLabel ? LABEL_HEIGHT : '0rem'} + ${theme.spacings.xs})`}
			${({ theme }) => theme.spacings.sm} ${({ theme }) => theme.spacings.xs};
	}
`
