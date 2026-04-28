import { writeFileSync } from 'fs'

import rulesModèleAS from 'modele-as'
import rulesModèleSocial from 'modele-social'
import rulesModèleTI from 'modele-ti'
import Engine from 'publicodes'

import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'

import {
	formatRulesToAlgolia,
	formatSimulationDataToAlgolia,
	type AlgoliaData,
} from './format'

const path = '../../source/public/simulation-data.json'
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const simuData = (await import(path)).default as unknown as Omit<
	SimulatorData,
	'component'
>

const parsedRulesModèleSocial = new Engine(rulesModèleSocial).getParsedRules()
const parsedRulesModèleAS = new Engine(rulesModèleAS).getParsedRules()
const parsedRulesModèleTI = new Engine(rulesModèleTI).getParsedRules()
const rules = [
	...formatRulesToAlgolia(parsedRulesModèleSocial),
	...formatRulesToAlgolia(parsedRulesModèleAS, 'modele-as'),
	...formatRulesToAlgolia(parsedRulesModèleTI, 'modele-ti'),
]

const simulateurs = formatSimulationDataToAlgolia(simuData)

const data: AlgoliaData = { rules, simulateurs }

writeFileSync('algolia-data.json', JSON.stringify(data, null, 2))
console.log(
	`Exported ${rules.length} rules and ${simulateurs.length} simulateurs to algolia-data.json`
)
