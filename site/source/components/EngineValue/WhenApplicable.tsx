import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import React from 'react'

import { useEngine } from '../utils/EngineContext'

export function WhenApplicable({
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
	const applicable = engineValue.evaluate({
		'est applicable': dottedName,
	}).nodeValue
	console.log(dottedName, applicable)
	if (applicable !== true) {
		return null
	}

	return <>{children}</>
}
