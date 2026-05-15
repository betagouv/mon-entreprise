import { CodeActivite } from '@/domaine/CodeActivite'
import { CodeCatégorieJuridique } from '@/domaine/CodeCatégorieJuridique'
import { Établissement } from '@/domaine/Établissement'
import { DottedName } from '@/domaine/publicodes/DottedName'
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

export const RÈGLES_IDENTITÉ_ENTREPRISE = [
	'entreprise . date de création',
	'entreprise . code catégorie juridique',
	'entreprise . catégorie juridique',
	'entreprise . SIREN',
	'entreprise . nom',
	'établissement . SIRET',
] as const satisfies ReadonlyArray<DottedName>

export type RègleIdentitéEntreprise =
	(typeof RÈGLES_IDENTITÉ_ENTREPRISE)[number]

const établissementEstLeSiège = (entreprise: Entreprise): boolean =>
	!!entreprise.siège &&
	!!entreprise.siège.adresse.complète &&
	entreprise.siège.adresse.complète ===
		entreprise.établissement.adresse.complète

export const établissementEstDifférentDuSiège = (
	entreprise: Entreprise
): boolean => !établissementEstLeSiège(entreprise)
