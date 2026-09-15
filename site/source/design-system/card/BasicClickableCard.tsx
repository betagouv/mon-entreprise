import React, { KeyboardEvent, useCallback } from 'react'
import { styled } from 'styled-components'

type Props = {
	children: React.ReactNode
	onClick: () => void
	ariaLabel: string
}

export const BasicClickableCard = ({ children, onClick, ariaLabel }: Props) => {
	const clickOnEnter = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				onClick()
			}
		},
		[onClick]
	)

	return (
		<Container
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={clickOnEnter}
			aria-label={ariaLabel}
		>
			{children}
		</Container>
	)
}

export const Container = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
	border: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};

	background: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[100]};

	transition:
		box-shadow 0.15s,
		background-color 0.15s;

	cursor: pointer;

	&:hover {
		box-shadow: ${({ theme }) =>
			theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3]};

		background: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[100]};
	}
`
