import { Li, Ul } from '@/design-system'
import { Références } from '@/domaine/documentation/References'

import { Référence } from './Reference'

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
