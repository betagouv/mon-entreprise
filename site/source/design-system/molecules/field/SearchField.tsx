import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import {
	SearchFieldState,
	useSearchFieldState,
} from '@react-stately/searchfield'
import { AriaSearchFieldProps } from '@react-types/searchfield'
import { useRef } from 'react'
import { css, styled } from 'styled-components'

import { FocusStyle } from '../../global-style'
import { SearchIcon, Spinner } from '../../icons'
import {
	StyledContainer,
	StyledDescription,
	StyledErrorMessage,
	StyledInput,
	StyledInputContainer,
	StyledLabel,
} from './TextField'

const SearchInput = styled(StyledInput)`
	&,
	&::-webkit-search-decoration,
	&::-webkit-search-cancel-button,
	&::-webkit-search-results-button,
	&::-webkit-search-results-decoration {
		-webkit-appearance: none;
	}
`

const SearchInputContainer = styled(StyledInputContainer)`
	padding-left: 0.5rem;
	&:focus-within {
		${FocusStyle}
	}
`

const IconContainer = styled.div<{ $hasLabel?: boolean }>`
	padding: calc(
			${({ $hasLabel = false }) => ($hasLabel ? '1rem' : '0rem')} + 0.5rem
		)
		0 0.5rem;
`

export function SearchField(
	props: AriaSearchFieldProps & {
		state?: SearchFieldState
		isSearchStalled?: boolean
	}
) {
	const innerState = useSearchFieldState(props)
	const state = props.state || innerState
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
				<IconContainer $hasLabel={!!props.label}>
					{props.isSearchStalled ? <Spinner /> : <SearchIcon aria-hidden />}
				</IconContainer>
				<SearchInput
					{...inputProps}
					placeholder={inputProps.placeholder ?? ''}
					ref={ref}
				/>
				{props.label && (
					<StyledLabel aria-hidden {...labelProps}>
						{props.label}
					</StyledLabel>
				)}
				{state.value !== '' && (
					<StyledClearButton {...buttonProps} ref={buttonRef}>
						×
					</StyledClearButton>
				)}
			</SearchInputContainer>
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

const StyledClearButton = styled.button`
	position: absolute;
	right: 0;
	background: transparent;
	border: none;
	font-size: 2rem;
	line-height: 2rem;
	height: ${({ theme }) => theme.spacings.xxxl};
	padding: ${({ theme }) => `${theme.spacings.md} ${theme.spacings.sm}`};
	${({ theme: { darkMode } }) =>
		darkMode &&
		css`
			color: white !important;
		`}
`
