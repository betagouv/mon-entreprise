import { CodeActivite } from '@/domain/CodeActivite'
import { CodeCatégorieJuridique } from '@/domain/CodeCatégorieJuridique'
import { Établissement } from '@/domain/Établissement'
import { Siren } from '@/domain/Siren'

export interface Entreprise {
	nom: string
	siren: Siren
	dateDeCréation: Date
	codeCatégorieJuridique: CodeCatégorieJuridique
	activitéPrincipale: CodeActivite
	siège?: Établissement
	établissement: Établissement
}

export const établissementEstLeSiège = (entreprise: Entreprise): boolean =>
	!!entreprise.siège &&
	!!entreprise.siège.adresse.complète &&
	entreprise.siège.adresse.complète ===
		entreprise.établissement.adresse.complète

export const établissementEstDifférentDuSiège = (
	entreprise: Entreprise
): boolean => !établissementEstLeSiège(entreprise)
