import { Adresse } from '@/domaine/Adresse'
import { CodeActivite } from '@/domaine/CodeActivite'
import { Siret } from '@/domaine/Siren'

export interface Établissement {
	siret: Siret
	adresse: Adresse
	activitéPrincipale: CodeActivite
}
