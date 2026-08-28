import type { ComponentType } from 'react'

export type DocumentationDeValeur = {
	titre: () => string
	chemin: string
	Résumé: ComponentType
	Références: ComponentType
}
