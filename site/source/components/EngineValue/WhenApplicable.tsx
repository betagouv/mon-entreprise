import Engine from 'publicodes'
import React from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'

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

	if (applicable !== true) {
		return null
	}

	return <>{children}</>
}
