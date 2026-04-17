import { ReactNode } from 'react'

import { H3 } from '@/design-system'

type Props = {
	title: string
	children: ReactNode
}

export const Section = ({ title, children }: Props) => (
	<section>
		<H3>{title}</H3>

		{children}
	</section>
)
