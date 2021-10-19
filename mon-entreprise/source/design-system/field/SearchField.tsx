import { InputHTMLAttributes, useRef } from 'react'
import { useSearchField } from '@react-aria/searchfield'
import { AriaSearchFieldProps } from '@react-types/searchfield'
import { useSearchFieldState } from '@react-stately/searchfield'
import {
	StyledContainer,
	StyledDescription,
	StyledInput,
	StyledInputContainer,
	StyledErrorMessage,
	StyledLabel,
} from './TextField'
import styled from 'styled-components'

export default function SearchField(props: AriaSearchFieldProps) {
	const state = useSearchFieldState(props)
	const ref = useRef<HTMLInputElement>(null)
	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
		clearButtonProps,
	} = useSearchField(props, state, ref)

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
				{state.value !== '' && (
					<StyledClearButton {...clearButtonProps}>×</StyledClearButton>
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

const StyledClearButton = styled.button`
	position: absolute;
	right: 0;
	font-size: 2rem;
	line-height: 2rem;
	height: ${({ theme }) => theme.spacings.xxxl};
	padding: ${({ theme }) => `${theme.spacings.md} ${theme.spacings.sm}`};
`
