import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { Body, H3, H4, Strong } from '@/design-system'

export const TitreSection = styled(H3)`
	border-bottom: 1px solid rgba(0, 0, 0, 0.85);
	background-color: inherit;
	print-color-adjust: exact !important;
	margin: 0;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	padding-bottom: 0.5rem;
	padding-left: 0;
	align-self: flex-end;
	width: 100%;
	font-size: 1.125rem;
`

export const Titre = styled(H4)`
	margin: 2rem 0 0;
	scroll-margin-top: 1rem;
	font-family: "Montserrat", sans-serif;
	font-weight: 700;
	color: hsl(var(--COLOR_HUE), calc(var(--COLOR_SATURATION) - 34%), 33%);
	font-size: 1rem;
	line-height: 1.75rem;
	text-align: left;
	background-color: transparent;
`

export const Liste = styled.ul`
	list-style: none;
	padding-left: 0;
`

type Props = {
	children: ReactNode
}

export const EnTête = ({ children }: Props) => (
	<TexteBleu>
		<Strong>{children}</Strong>
	</TexteBleu>
)
const TexteBleu = styled(Body)`
	margin: 0;
	color: ${({ theme }) => theme.colors.bases.primary[700]};
`