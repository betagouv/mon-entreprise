import { serviceIndépendant } from './serviceIndépendant'

// TODO: gérer les traductions
export const serviceIndépendantConditionnel = {
	...serviceIndépendant,
	associatedRule: 'entreprise . activité . libérale . réglementée = non',
}
