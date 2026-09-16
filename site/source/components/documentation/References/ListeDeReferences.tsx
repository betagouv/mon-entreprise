import { Li, Ul } from '@/design-system'
import { Références } from '@/domaine/documentation/References'

import { Référence } from './Reference'

export const ListeDeRéférences = ({
	références,
}: {
	références: Références
}) => {
	const entrées = Object.entries(références)

	if (entrées.length === 0) {
		return null
	}

	return (
		<Ul>
			{entrées.map(([titre, href]) => (
				<Li key={href}>
					<Référence titre={titre} href={href} />
				</Li>
			))}
		</Ul>
	)
}
