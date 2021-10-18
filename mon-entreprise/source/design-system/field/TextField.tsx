import { InputHTMLAttributes, useRef } from 'react'
import styled, { css } from 'styled-components'
import { useTextField, AriaTextFieldOptions } from '@react-aria/textfield'
import { ExtraSmallBody } from 'DesignSystem/typography/paragraphs'

const LABEL_HEIGHT = '1rem'

export default function TextField(props: AriaTextFieldOptions) {
	const ref = useRef<HTMLInputElement>(null)
	const { labelProps, inputProps, descriptionProps, errorMessageProps } =
		useTextField({ ...props, inputElementType: 'input' }, ref)

	return (
		<StyledContainer>
			<StyledInputContainer
				error={!!props.errorMessage || props.validationState === 'invalid'}
			>
				<StyledInput
					{...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
					ref={ref}
				/>
				<StyledLabel {...labelProps}>{props.label}</StyledLabel>
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
	width: 100%;
	min-width: fit-content;
	margin-bottom: ${({ theme }) => theme.spacings.lg};
`
export const StyledInput = styled.input`
	font-size: 1rem;
	line-height: 1.5rem;
	border: none;
	background: none;
	font-family: ${({ theme }) => theme.fonts.main};
	bottom: 0;
	width: 100%;
	height: 100%;
	outline: none;
	position: absolute;
	padding: calc(${LABEL_HEIGHT} + ${({ theme }) => theme.spacings.xs})
		${({ theme }) => theme.spacings.sm} ${({ theme }) => theme.spacings.xs};
`

export const StyledLabel = styled.label`
	top: 0%;
	transform: translateY(0%);

	font-size: 0.75rem;
	line-height: ${LABEL_HEIGHT};
	font-family: ${({ theme }) => theme.fonts.main};
	padding: ${({ theme }) => theme.spacings.xs}
		${({ theme }) => theme.spacings.sm};
	position: absolute;
	will-change: transform top font-size line-height color;
	transition: all 0.1s;
`

export const StyledDescription = styled(ExtraSmallBody)`
	padding: ${({ theme }) => theme.spacings.xxs}
		${({ theme }) => theme.spacings.sm};
	will-change: color;
	transition: color 0.2s;
`

const StyledErrorMessage = styled(StyledDescription)`
	color: ${({ theme }) => theme.colors.extended.error[400]} !important;
`

export const StyledInputContainer = styled.div<{ error: boolean }>`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) =>
		`${theme.box.borderWidth} solid ${theme.colors.extended.grey[500]}`};
	outline: transparent solid 1px;
	position: relative;
	flex-direction: column;
	transition: all 0.2s;
	height: ${({ theme }) => theme.spacings.xxxl};
	:focus-within {
		outline-color: ${({ theme, error }) =>
			error
				? theme.colors.extended.error[400]
				: theme.colors.bases.primary[600]};
	}
	:focus-within ${StyledLabel} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	:focus-within + ${StyledDescription} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	input:not(:focus):placeholder-shown + ${StyledLabel} {
		font-size: 1rem;
		line-height: 1.5rem;
		pointer-events: none;
		top: 50%;
		transform: translateY(-50%);
	}

	${({ theme, error }) =>
		error &&
		css`
			&& {
				border-color: ${theme.colors.extended.error[400]};
			}
			&&& label {
				color: ${theme.colors.extended.error[400]};
			}
		`}
`
