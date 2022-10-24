import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield'
import { ExtraSmallBody } from '@/design-system/typography/paragraphs'
import { HTMLAttributes, RefObject, useRef } from 'react'
import styled, { css } from 'styled-components'

const LABEL_HEIGHT = '1rem'

type TextAreaFieldProps = AriaTextFieldOptions<'textarea'> & {
	inputRef?: RefObject<HTMLTextAreaElement>
	small?: boolean
	rows?: number | undefined
}

export default function TextAreaField(props: TextAreaFieldProps) {
	const ref = useRef<HTMLTextAreaElement>(null)

	const { labelProps, inputProps, descriptionProps, errorMessageProps } =
		useTextField(
			{ ...props, inputElementType: 'textarea' },
			props.inputRef || ref
		)

	return (
		<StyledContainer>
			<StyledTextAreaContainer
				hasError={!!props.errorMessage || props.validationState === 'invalid'}
				hasLabel={!!props.label && !props.small}
			>
				<StyledTextArea
					{...(props as HTMLAttributes<HTMLTextAreaElement>)}
					{...(inputProps as HTMLAttributes<HTMLTextAreaElement>)}
					placeholder={inputProps.placeholder ?? ''}
					ref={props.inputRef || ref}
				/>
				{props.label && (
					<StyledLabel className={props.small ? 'sr-only' : ''} {...labelProps}>
						{props.label}
					</StyledLabel>
				)}
			</StyledTextAreaContainer>
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
`
export const StyledTextArea = styled.textarea`
	font-size: 1rem;
	line-height: 1.5rem;
	border: none;
	width: 100%;
	background: none;
	font-family: ${({ theme }) => theme.fonts.main};
	height: 100%;
	outline: none;
	transition: color 0.2s;
	::placeholder {
		${({ theme }) =>
			theme.darkMode &&
			css`
				opacity: 0.6;
			`}
		color: ${({ theme }) =>
			theme.colors.extended.grey[theme.darkMode ? 200 : 600]};
	}
	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
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
			}
		`}
`

export const StyledDescription = styled(ExtraSmallBody)`
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.sm}`};
	will-change: color;
	transition: color 0.2s;
	margin-top: 0;
`

export const StyledErrorMessage = styled(StyledDescription)`
	color: ${({ theme }) => theme.colors.extended.error[400]} !important;
`

export const StyledSuffix = styled.span`
	font-size: 1rem;
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
`

export const StyledTextAreaContainer = styled.div<{
	hasError: boolean
	hasLabel: boolean
	small?: boolean
}>`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) =>
		`${theme.box.borderWidth} solid ${
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[700]
		}`};
	outline: transparent solid 1px;
	position: relative;
	display: flex;
	background-color: ${({ theme }) =>
		theme.darkMode
			? 'rgba(255, 255, 255, 20%)'
			: theme.colors.extended.grey[100]};
	align-items: center;
	transition: all 0.2s;

	:focus-within {
		outline-color: ${({ theme, hasError }) =>
			hasError
				? theme.colors.extended.error[400]
				: theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[700]};
	}
	:focus-within ${StyledLabel} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	:focus-within + ${StyledDescription} {
		${({ theme }) =>
			!theme.darkMode &&
			css`
				color: ${theme.colors.bases.primary[800]};
			`}
	}

	${({ hasLabel }) =>
		hasLabel &&
		css`
			${StyledTextArea}:not(:focus):placeholder-shown {
				color: transparent;
			}
			${StyledTextArea}:not(:focus):placeholder-shown + ${StyledSuffix} {
				color: transparent;
			}
		`}

	${StyledTextArea}:not(:focus):placeholder-shown:not(:empty) + ${StyledLabel} {
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

	${StyledTextArea}, ${StyledSuffix} {
		padding: ${({ hasLabel, theme, small }) =>
			small
				? css`
						${theme.spacings.xxs} ${theme.spacings.xs}
				  `
				: css`calc(${hasLabel ? LABEL_HEIGHT : '0rem'} + ${
						theme.spacings.xs
				  }) ${theme.spacings.sm} ${theme.spacings.xs}`};
	}

	${({ small }) =>
		small &&
		css`
			${StyledSuffix}, ${StyledTextArea} {
				font-size: 1rem;
				line-height: 1.25rem;
			}
		`}
`
