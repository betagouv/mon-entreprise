import { pipe } from 'ramda'
import { currentSimulationSelector } from 'Selectors/storageSelectors'

export const serialize = pipe(currentSimulationSelector, JSON.stringify)

export const deserialize = JSON.parse
