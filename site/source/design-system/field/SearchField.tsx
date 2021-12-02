import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useSearchFieldState } from '@react-stately/searchfield'
import { AriaSearchFieldProps } from '@react-types/searchfield'
import { Loader } from 'DesignSystem/icons/Loader'
import { SearchIcon } from 'DesignSystem/icons/SearchIcon'
import { InputHTMLAttributes, useRef } from 'react'
import styled from 'styled-components'
import {
	StyledContainer,
	StyledDescription,
	StyledErrorMessage,
	StyledInput,
	StyledInputContainer,
	StyledLabel,
} from './TextField'

const SearchInput = styled(StyledInput)`
	&::-webkit-search-decoration,
	&::-webkit-search-cancel-button,
	&::-webkit-search-results-button,
	&::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
`

const SearchInputContainer = styled(StyledInputContainer)`
	padding-left: 0.5rem;
`

export default function SearchField(
	props: AriaSearchFieldProps & { isSearchStalled: boolean }
) {
	const state = useSearchFieldState(props)
	const ref = useRef<HTMLInputElement>(null)
	const buttonRef = useRef(null)
	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
		clearButtonProps,
	} = useSearchField(props, state, ref)
	const { buttonProps } = useButton(clearButtonProps, buttonRef)

	return (
		<StyledContainer>
			<SearchInputContainer
				hasError={!!props.errorMessage || props.validationState === 'invalid'}
				hasLabel={!!props.label}
			>
				{props.isSearchStalled ? <Loader /> : <SearchIcon />}
				<SearchInput
					{...(props as InputHTMLAttributes<HTMLInputElement>)}
					{...inputProps}
					placeholder={inputProps.placeholder ?? ''}
					ref={ref}
				/>
				{props.label && (
					<StyledLabel {...labelProps}>{props.label}</StyledLabel>
				)}
				{state.value !== '' && (
					<StyledClearButton {...buttonProps} ref={buttonRef}>
						×
					</StyledClearButton>
				)}
			</SearchInputContainer>
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
