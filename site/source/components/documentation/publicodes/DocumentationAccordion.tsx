import { RulePage } from '@publicodes/react-ui'
import { ComponentProps } from 'react'
import { styled } from 'styled-components'

import { Accordion, Item } from '@/design-system'

type Renderers = ComponentProps<typeof RulePage>['renderers']
type AccordionProps = ComponentProps<NonNullable<Renderers['Accordion']>>

export default function DocumentationAccordion({ items }: AccordionProps) {
	return (
		<StyledAccordion>
			{items.map(({ title, id, children }) => (
				<Item title={title} key={id} hasChildItems={false}>
					{children}
				</Item>
			))}
		</StyledAccordion>
	)
}

const StyledAccordion = styled(Accordion)`
	margin: 1.5rem 0;
	overflow: hidden;

	${Accordion.StyledTitle} {
		margin: 0;
		& span {
			font-weight: bold;
		}
	}
`
