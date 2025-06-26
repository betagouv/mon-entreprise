import React from 'react'

import { useBrowserOnly } from '@/hooks/useBrowserOnly'

/**
 * Display the children only on the browser (client-side).
 */
export default function BrowserOnly({
	children,
}: {
	children: React.ReactNode
}) {
	return useBrowserOnly() ? children : null
}
