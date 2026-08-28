import { MDXProvider } from '@mdx-js/react'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

import ImgRenderer from '../markdown/ImgRenderer'
import TextRenderer from '../markdown/TextRenderer'
import {
	Body,
	Code,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	Li,
	Ol,
	Pre,
	Strong,
	U,
	Ul,
} from '../typography'

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

export const components = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
	p: Body,
	strong: Strong,
	u: U,
	ul: Ul,
	ol: Ol,
	li: Li,
	code: Code,
	pre: Pre,
	span: TextRenderer,
	blockquote: Blockquote,
	img: ImgRenderer,
}

type Props = {
	children: ReactNode
}

export const MDXWrapper = ({ children }: Props) => (
	<MDXProvider components={components}>
		<MDXContent>{children}</MDXContent>
	</MDXProvider>
)

export const MDXContent = styled.div`
	max-width: 45rem;
	font-family: ${({ theme }) => theme.fonts.main};
`
