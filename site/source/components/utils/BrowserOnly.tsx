import React from 'react'

import { Appear } from '@/components/ui/animate'

// We add a animation for all coponents displayed on the client only but not on
// the SSR to avoid augment the CLS (Cumulative Layout Shift).
export default function BrowserOnly({
	children,
}: {
	children: React.ReactNode
}) {
	if (import.meta.env.SSR) {
		return null
	}

	return <Appear>{children}</Appear>
}
