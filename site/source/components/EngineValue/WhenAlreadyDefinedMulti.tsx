import Engine from 'publicodes'
import React from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

export function WhenAlreadyDefinedMulti({
	dottedNames,
	children,
	engine,
}: {
	dottedNames: DottedName[]
	children: React.ReactNode
	engine?: Engine<DottedName>
}) {
	const defaultEngine = useEngine()

	const engineValue = engine ?? defaultEngine

	const notAllAlreadyDefined = dottedNames.some(
		(dottedName) =>
			engineValue.evaluate({ 'est non défini': dottedName }).nodeValue
	)

	if (notAllAlreadyDefined) {
		return null
	}

	return <>{children}</>
}
