import React from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'

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
