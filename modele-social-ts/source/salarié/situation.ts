import { Situation, SituationAvecEntreprise } from '../situation'
import { EurosParMois } from './salaireBrut'

export interface SituationSalarié extends Situation, SituationAvecEntreprise {
	salaireBrut: EurosParMois
	salaireNet: EurosParMois
	catégorieJuridique: 'Entreprise'
}
