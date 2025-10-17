import Engine from 'publicodes'
import { useContext } from 'react'

import { EngineContext } from '@/components/utils/EngineContext'
import { DottedName } from '@/domaine/publicodes/DottedName'

export function useEngine() {
	return useContext(EngineContext) as Engine<DottedName>
}
