import Engine from 'publicodes'
import React from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'

export function WhenAlreadyDefined({
	dottedName,
	children,
	engine,
}: {
	dottedName: DottedName
	children: React.ReactNode
	engine?: Engine<DottedName>
}) {
	const defaultEngine = useEngine()

	const engineValue = engine ?? defaultEngine

	if (engineValue.evaluate({ 'est non défini': dottedName }).nodeValue) {
		return null
	}

	return <>{children}</>
}
