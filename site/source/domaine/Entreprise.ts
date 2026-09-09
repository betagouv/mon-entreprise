import { CodeActivite } from '@/domaine/CodeActivite'
import { CodeCatégorieJuridique } from '@/domaine/CodeCatégorieJuridique'
import { Établissement } from '@/domaine/Établissement'
import { Siren } from '@/domaine/Siren'

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
