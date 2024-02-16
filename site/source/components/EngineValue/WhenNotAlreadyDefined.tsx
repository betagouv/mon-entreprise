import { DottedName } from 'modele-social'
import React from 'react'

import { useEngine } from '../utils/EngineContext'

export function WhenNotAlreadyDefined({
	dottedName,
	children,
}: {
	dottedName: DottedName
	children: React.ReactNode
}) {
	const engine = useEngine()
	if (engine.evaluate({ 'est défini': dottedName }).nodeValue) {
		return null
	}

	return <>{children}</>
}
