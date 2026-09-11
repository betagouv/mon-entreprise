import { MDXProvider } from '@mdx-js/react'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { componentsRendering } from '../componentsRendering'

const Blockquote = styled.blockquote`
	margin: ${({ theme }) => `${theme.spacings.md} 0`};
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
	border-left: 4px solid ${({ theme }) => theme.colors.bases.secondary[500]};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[700]
			: theme.colors.extended.grey[200]};
	font-style: italic;
`

type Props = {
	children: ReactNode
}

export const MDXWrapper = ({ children }: Props) => (
	<MDXProvider
		components={{
			...componentsRendering,
			blockquote: Blockquote,
		}}
	>
		<MDXContent>{children}</MDXContent>
	</MDXProvider>
)

const MDXContent = styled.div`
	max-width: 45rem;
	font-family: ${({ theme }) => theme.fonts.main};
`
