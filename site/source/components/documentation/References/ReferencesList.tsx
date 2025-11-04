import { Li, Ul } from '@/design-system'

import Reference from './Reference'

export const ReferencesList = ({
	references,
}: {
	references: Record<string, string>
}) => (
	<Ul>
		{Object.entries(references).map(([title, href]) => (
			<Li key={href}>
				<Reference title={title} href={href} />
			</Li>
		))}
	</Ul>
)
