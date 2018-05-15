/* @flow */

export type Événements =
	| 'poursuite du CDD en CDI'
	| 'refus CDI avantageux'
	| 'rupture anticipée salarié'
	| 'rupture pour faute grave ou force majeure'
	| 'rupture pendant période essai'
	| 'non'

export type Motifs =
	| 'contrat aidé'
	| 'complément formation'
	| "issue d'apprentissage "
	| MotifsClassiques

export type MotifsClassiques =
	| 'remplacement'
	| 'accroissement activité'
	| 'saisonnier'
	| 'usage'
	| 'mission'

export type CDD = {
	événements: Événements,
	motif: Motifs
}
