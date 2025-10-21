import { RulePage } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { ComponentProps, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { styled } from 'styled-components'

import { References } from '@/components/References'
import {
	BodyStyle,
	H1Style,
	H2Style,
	H3Style,
	H4Style,
	H5Style,
	Link,
	ListProps,
	Markdown,
	StyledLinkProps,
	StyledLinkStyle,
	UlStyle,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'

import DocumentationAccordion from './DocumentationAccordion'

export default function DocumentationPageBody({
	documentationPath,
	engine,
}: {
	documentationPath: string
	engine: Engine
}) {
	const { absoluteSitePaths } = useSitePaths()
	const { i18n } = useTranslation()
	const params = useParams<{ '*': string }>()

	const { current: renderers } = useRef({
		Head: Helmet,
		Link,
		Text: Markdown,
		References,
		Accordion: DocumentationAccordion,
	} as ComponentProps<typeof RulePage>['renderers'])

	return (
		<StyledDocumentation>
			<RulePage
				language={i18n.language as 'fr' | 'en'}
				rulePath={params['*'] ?? ''}
				engine={engine}
				documentationPath={documentationPath}
				renderers={renderers}
				apiDocumentationUrl={absoluteSitePaths.développeur.api}
				apiEvaluateUrl="https://mon-entreprise.urssaf.fr/api/v1/evaluate"
				npmPackage="modele-social"
				mobileMenuPortalId="mobile-menu-portal-id"
			/>
		</StyledDocumentation>
	)
}

const StyledDocumentation = styled.div<ListProps & StyledLinkProps>`
	h1 {
		${H1Style}
		margin-top: 1rem;
	}
	h2 {
		${H2Style}
	}
	h3 {
		${H3Style}
	}
	h4 {
		${H4Style}
	}
	h5 {
		${H5Style}
	}
	p {
		${BodyStyle}
	}
	ul {
		${UlStyle}
	}
	a {
		${StyledLinkStyle}
	}

	font-family: ${({ theme }) => theme.fonts.main};

	.publicodes_btn-small {
		font-size: 0.8rem;
		background-color: ${({ theme }) => theme.colors.extended.grey[200]};
		border-radius: ${({ theme }) => theme.box.borderRadius};
		border: none;
		padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.xs}`};
		color: ${({ theme }) => theme.colors.extended.grey[800]};

		&:hover {
			background-color: ${({ theme }) => theme.colors.extended.grey[300]};
		}
	}
	#documentation-rule-root nav ul li span button,
	#documentation-rule-root nav ul li.active .content {
		background-color: hsl(0deg 0% 90% / 50%);
	}
	#documentation-rule-root .node-value-pointer,
	#documentation-rule-root pre {
		background-color: ${({ theme }) =>
			theme.darkMode && theme.colors.extended.dark[600]};
	}
`
