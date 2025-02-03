import { PropsWithChildren } from 'react'

import { Message } from '@/design-system'
import { SmallBody } from '@/design-system/typography/paragraphs'

export default function AvertissementDansObjectifDeSimulateur({
	children,
}: PropsWithChildren) {
	return (
		<Message type="error">
			<SmallBody>{children}</SmallBody>
		</Message>
	)
}
