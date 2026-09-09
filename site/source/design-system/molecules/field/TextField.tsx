import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield'
import { HTMLAttributes, RefObject, useRef } from 'react'
import { css, styled } from 'styled-components'

import { omit } from '@/utils'

import { ExtraSmallBody } from '../../typography/paragraphs'

const LABEL_HEIGHT = '1rem'

type TextFieldProps = AriaTextFieldOptions<'input'> & {
	errorMessage?: string
	inputRef?: RefObject<HTMLInputElement>
	small?: boolean
	id?: string
	role?: string
}

export default function TextField(props: TextFieldProps) {
	const ref = useRef<HTMLInputElement>(null)

	const { labelProps, inputProps, descriptionProps, errorMessageProps } =
		useTextField({ ...props, inputElementType: 'input' }, props.inputRef || ref)

	return (
		<StyledContainer>
			<StyledInputContainer
				hasError={!!props.errorMessage || props.validationState === 'invalid'}
				hasLabel={!!props.label && !props.small}
			>
				<StyledInput
					{...(omit(
						props,
						'label',
						'errorMessage'
					) as HTMLAttributes<HTMLInputElement>)}
					{...(inputProps as HTMLAttributes<HTMLInputElement>)}
					{...(props.id && { id: props.id })}
					role={props.role}
					placeholder={
						(inputProps as HTMLAttributes<HTMLInputElement>).placeholder ??
						undefined
					}
					ref={props.inputRef || ref}
				/>
				{props.label && (
					<StyledLabel className={props.small ? 'sr-only' : ''} {...labelProps}>
						{props.label}
					</StyledLabel>
				)}
			</StyledInputContainer>
			{props.errorMessage && (
				<StyledErrorMessage {...errorMessageProps} role="alert">
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
`
export const StyledInput = styled.input`
	font-size: 1rem;
	line-height: 1.5rem;
	border: none;
	width: 100%;
	background: none;
	font-family: ${({ theme }) => theme.fonts.main};
	height: 100%;
	outline: none;
	transition: color 0.2s;
	&::placeholder {
		${({ theme }) =>
			theme.darkMode &&
			css`
				opacity: 1;
			`}
		color: ${({ theme }) =>
			theme.colors.extended.grey[theme.darkMode ? 200 : 600]}!important;
		background-color: transparent;
	}
	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
				background-color: transparent;
			}
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
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
				background-color: transparent;
			}
		`}
`

export const StyledDescription = styled(ExtraSmallBody)`
	margin-top: ${({ theme }) => `${theme.spacings.xxs}`};
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.sm}`};
	will-change: color;
	transition: color 0.2s;
`

export const StyledErrorMessage = styled(StyledDescription)`
	padding: 0;
	color: ${({ theme }) => theme.colors.extended.error[400]} !important;
	background-color: inherit;
`

export const StyledSuffix = styled.span`
	font-size: 1rem;
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
`

export const StyledInputContainer = styled.div.withConfig({
	shouldForwardProp: (prop) =>
		!['hasError', 'hasLabel', 'small'].includes(prop),
})<{
	hasError: boolean
	hasLabel: boolean
	small?: boolean
}>`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) =>
		`${theme.box.borderWidth} solid
		${
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[700]
		}`};
	outline: transparent solid 1px;
	position: relative;
	display: flex;
	background-color: ${({ theme }) =>
		theme.darkMode
			? 'rgba(255, 255, 255, 10%)'
			: theme.colors.extended.grey[100]};
	align-items: center;
	transition: all 0.2s;

	&:focus-within {
		outline-color: ${({ theme, hasError }) =>
			hasError
				? theme.colors.extended.error[400]
				: theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[700]};
		outline-offset: ${({ theme }) => theme.spacings.xxs};
		outline-width: ${({ theme }) => theme.spacings.xxs};
	}
	&:focus-within ${StyledLabel} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
		background-color: transparent;
	}

	&:focus-within + ${StyledDescription} {
		${({ theme }) =>
			!theme.darkMode &&
			css`
				color: ${theme.colors.bases.primary[800]};
				background-color: transparent;
			`}
	}

	${({ hasLabel }) =>
		hasLabel &&
		css`
			${StyledInput}:not(:focus):placeholder-shown {
				color: transparent;
				background-color: transparent;
			}
			${StyledInput}:not(:focus):placeholder-shown + ${StyledSuffix} {
				color: transparent;
				background-color: transparent;
			}
		`}

	${StyledInput}:not(:focus):placeholder-shown:not(:empty) + ${StyledLabel} {
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
				background-color: transparent;
			}
		`}

	${StyledInput}, ${StyledSuffix} {
		padding: ${({ hasLabel, theme, small }) =>
			small
				? css`
						${theme.spacings.xxs} ${theme.spacings.xs}
				  `
				: css`calc(${hasLabel ? LABEL_HEIGHT : '0rem'} + ${
						theme.spacings.xs
				  }) ${theme.spacings.sm} ${theme.spacings.xs}`};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[800]};
	}

	${({ small }) =>
		small &&
		css`
			${StyledSuffix}, ${StyledInput} {
				font-size: 1rem;
				line-height: 1.25rem;
			}
		`}
`
