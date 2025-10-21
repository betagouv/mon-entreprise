import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { Rules } from '@/domaine/publicodes/Rules'
import { ModeleId } from '@/domaine/SimulationConfig'

import { engineFactory } from './engineFactory'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'

const defaultModele = 'modele-social' as ModeleId
const engines = {} as Record<ModeleId, Engine<DottedName>>

export const loadEngine = async (modele?: ModeleId) => {
	console.log('loadEngine')
	const modeleId = modele || defaultModele
	const rules = (await import(`../../../../${modeleId}/dist/index.js`))
		.default as Rules
	const engine = engineFactory(rules)

	return engine
}

export const loadEngineFromModeleId = async (modele?: ModeleId) => {
	console.log('loadEngineFromModeleId')
	const modeleId = modele || defaultModele

	if (!engines[modeleId]) {
		const rules = (await import(`../../../../${modeleId}/dist/index.js`))
			.default as Rules
		engines[modeleId] = engineFactory(rules)
	}
}

export const getEngine = (modeleId: ModeleId) =>
	engines[modeleId]

export const setEngineSituation = (modeleId: ModeleId, situation: SituationPublicodes) => {
	const modele = modeleId

	engines[modele] = engines[modele]?.setSituation(situation)
}
	
