import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configProfessionLibérale: SimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . activité': "'libérale'",
		'entreprise . EI': 'oui',
	},
}

const configFromPLMetier = (metier: string): SimulationConfig => ({
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . libérale . réglementée': 'oui',
		'indépendant . profession libérale . réglementée . métier': `'${metier}'`,
	},
})

export const configAuxiliaire = configFromPLMetier('santé . auxiliaire médical')
export const configDentiste = configFromPLMetier('santé . chirurgien-dentiste')
export const configMédecin = configFromPLMetier('santé . médecin')
export const configPharmacien = configFromPLMetier('santé . pharmacien')
export const configSageFemme = configFromPLMetier('santé . sage-femme')
export const configAvocat = configFromPLMetier('juridique . avocat')
export const configExpertComptable = configFromPLMetier('expert-comptable')
