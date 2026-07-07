import { PropsWithChildren } from 'react'

import { Message, SmallBody } from '@/design-system/index'

export default function AvertissementDansObjectifDeSimulateur({
	children,
}: PropsWithChildren) {
	return (
		<Message type="error">
			<SmallBody>{children}</SmallBody>
		</Message>
	)
}
