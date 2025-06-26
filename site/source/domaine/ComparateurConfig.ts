import { NonEmptyReadonlyArray } from 'effect/Array'

import { Contexte } from '@/domaine/Contexte'
import { SimulationConfig } from '@/domaine/SimulationConfig'

export interface ComparateurConfig extends SimulationConfig {
	contextes: NonEmptyReadonlyArray<Contexte>
}

export const isComparateurConfig = (
	config: SimulationConfig
): config is ComparateurConfig => 'contextes' in config
