import { NonEmptyReadonlyArray } from 'effect/Array'

import { Contexte } from '@/domaine/Contexte'
import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

export interface ComparateurConfig extends PublicodesSimulationConfig {
	contextes: NonEmptyReadonlyArray<Contexte>
}

export const isComparateurConfig = (
	config: PublicodesSimulationConfig
): config is ComparateurConfig => 'contextes' in config
