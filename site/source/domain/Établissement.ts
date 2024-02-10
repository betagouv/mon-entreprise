import { Adresse } from '@/domain/Adresse'
import { CodeActivite } from '@/domain/CodeActivite'
import { Siret } from '@/domain/Siren'

export interface Établissement {
	siret: Siret
	adresse: Adresse
	activitéPrincipale: CodeActivite
}
