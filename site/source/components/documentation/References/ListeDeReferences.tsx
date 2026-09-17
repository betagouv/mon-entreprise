import { Li, Ul } from '@/design-system'

import { Référence } from './Reference'
import { Références } from './references'

export const ListeDeRéférences = ({
	références,
}: {
	références: Références
}) => (
	<Ul>
		{Object.entries(références).map(([titre, href]) => (
			<Li key={href}>
				<Référence titre={titre} href={href} />
			</Li>
		))}
	</Ul>
)
