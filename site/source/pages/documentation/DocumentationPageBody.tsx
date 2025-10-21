import { RulePage } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { ComponentProps, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { styled } from 'styled-components'

import { References } from '@/components/References'
import {
	Body,
	H1,
	H2,
	H3,
	H4,
	H5,
	Li,
	Link,
	Markdown,
	StyledLink,
	Ul,
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

const StyledDocumentation = styled.div`
	h1 {
		${(props) => componentCSS(H1, props)}
		margin-top: 1rem;
	}
	h2 {
		${(props) => componentCSS(H2, props)}
	}
	h3 {
		${(props) => componentCSS(H3, props)}
	}
	h4 {
		${(props) => componentCSS(H4, props)}
	}
	h5 {
		${(props) => componentCSS(H5, props)}
	}
	p {
		${(props) => componentCSS(Body, props)}
	}
	Ul {
		${(props) => componentCSS(Ul, props)}
	}
	Li {
		${(props) => componentCSS(Li, props)}
	}
	a {
		${(props) => componentCSS(StyledLink, props)}
	}

	font-family: ${({ theme }) => theme.fonts.main};

	.publicodes_btn-small {
		font-size: 0.8rem;
		background-color: ${({ theme }) => theme.colors.extended.grey[200]};
		border-radius: ${({ theme }) => theme.box.borderRadius};
		border: none;
		padding: ${({ theme }) => theme.spacings.xxs}
			${({ theme }) => theme.spacings.xs};
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

type OverrideComponentType = {
	componentStyle: {
		rules: Array<
			| ((
					props: Record<string, unknown>
			  ) =>
					| string
					| false
					| null
					| undefined
					| OverrideComponentType['componentStyle']['rules'])
			| string
		>
	}
}

// HACKKKKY THING. DO NOT DO THIS AT HOME
function componentCSS(Compo: unknown, props: Record<never, never>): string {
	const rules =
		'componentStyle' in (Compo as OverrideComponentType)
			? (Compo as OverrideComponentType).componentStyle.rules
			: (Compo as string[])

	return rules
		.map((x) => {
			if (typeof x !== 'function') {
				return x
			}
			const result = x(props)
			if ((result ?? false) === false) {
				return ''
			}
			if (typeof result === 'string') {
				return result
			}
			if (Array.isArray(result)) {
				return componentCSS(result, props)
			}
			// eslint-disable-next-line no-console
			console.error('Should not happen', result, typeof result)

			return false
		})
		.join('')
}
