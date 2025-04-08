import { ReactNode } from 'react'
import { css, styled } from 'styled-components'

import { Strong } from '.'
import { StyledLinkHover } from './link'
import { Body } from './paragraphs'

type TitreObjectifProps = {
	id?: string
	children: ReactNode
	htmlFor?: string
	isInfoMode?: boolean
	noWrap?: boolean
}

export const TitreObjectif = ({
	id,
	children,
	htmlFor,
	isInfoMode = false,
	noWrap = false,
}: TitreObjectifProps) => {
	if (isInfoMode) {
		return (
			<StyledBody id={id} $noWrap={noWrap}>
				<Strong>{children}</Strong>
			</StyledBody>
		)
	}

	return (
		<StyledLabel htmlFor={htmlFor} id={id} $noWrap={noWrap}>
			{children}
		</StyledLabel>
	)
}

const StyledBody = styled(Body)<{ $noWrap?: boolean }>`
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
	${({ $noWrap }) =>
		$noWrap &&
		css`
			white-space: nowrap;
		`}
`

const StyledLabel = styled.label<{ $noWrap?: boolean }>`
	cursor: pointer;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	text-decoration: underline dotted;
	text-underline-offset: 4px;
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
