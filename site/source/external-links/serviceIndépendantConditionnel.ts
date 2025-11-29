import { serviceIndépendant } from './serviceIndépendant'

export const serviceIndépendantConditionnel = {
	...serviceIndépendant,
	associatedRule: 'entreprise . activité . libérale . réglementée = non',
}
