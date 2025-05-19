import { ReactNode } from 'react'
import { css, styled } from 'styled-components'

import { StyledLinkHover } from './link'

export type TitreObjectifSaisissableProps = {
	id?: string
	htmlFor: string
	children: ReactNode
	noWrap?: boolean
}

export const TitreObjectifSaisissable = ({
	id,
	children,
	htmlFor,
	noWrap = false,
}: TitreObjectifSaisissableProps) => {
	return (
		<StyledLabel htmlFor={htmlFor} id={id} $noWrap={noWrap}>
			{children}
		</StyledLabel>
	)
}

const StyledLabel = styled.label<{ $noWrap?: boolean }>`
	cursor: pointer;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	text-decoration: underline dotted;
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.main};
	background-color: inherit;
	padding: 0;
	font-size: inherit;
	background: none;
	border: none;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	${({ $noWrap }) =>
		$noWrap &&
		css`
			white-space: nowrap;
		`}

	&:hover {
		${StyledLinkHover}
	}
`
