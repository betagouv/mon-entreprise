import Engine from 'publicodes'
import React from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

export function WhenNotApplicable({
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

	if (
		engineValue.evaluate({ 'est non applicable': dottedName }).nodeValue !==
		true
	) {
		return null
	}

	return <>{children}</>
}
