import { ReactNode } from 'react'

import { TitreSection } from './styledComponents'

type Props = {
	title: string
	children: ReactNode
}

export const Section = ({ title, children }: Props) => (
	<section>
		<TitreSection>{title}</TitreSection>

		{children}
	</section>
)
