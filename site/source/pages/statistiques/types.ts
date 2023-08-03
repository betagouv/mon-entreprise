// Generated using app.quicktype.io

export interface StatsStruct {
	visitesJours: Visites
	visitesMois: Visites
	satisfaction: PageSatisfaction[]
	retoursUtilisateurs: RetoursUtilisateurs
	nbAnswersLast30days: number
}

export interface RetoursUtilisateurs {
	open: Closed[]
	closed: Closed[]
}

export interface Closed {
	title: string
	closedAt: string | null
	number: number
	count: number
}

export interface BasePage {
	nombre: number
	page_chapter1: string
	page_chapter2: PageChapter2
	page_chapter3: string
}
export type Page = BasePage & { page: string; date: string }
export type PageSatisfaction = BasePage & {
	month: string
	click: SatisfactionLevel
}

export enum SatisfactionLevel {
	Bien = 'bien',
	Mauvais = 'mauvais',
	Moyen = 'moyen',
	TrèsBien = 'très bien',
}

interface Visites {
	creer: Page[]
	pages: Page[]
	site: Site[]
	api: API[]
}

interface Site {
	date: string
	nombre: number
}

interface API {
	date: string
	evaluate: number
	rules: number
	rule: number
}

export enum PageChapter2 {
	AideDeclarationIndependant = 'aide_declaration_independant',
	ArtisteAuteur = 'artiste_auteur',
	AutoEntrepreneur = 'auto_entrepreneur',
	ChomagePartiel = 'chomage_partiel',
	ComparaisonStatut = 'comparaison_statut',
	DirigeantSasu = 'dirigeant_sasu',
	EconomieCollaborative = 'economie_collaborative',
	Guide = 'guide',
	ImpotSociete = 'impot_societe',
	Independant = 'independant',
	ProfessionLiberale = 'profession_liberale',
	Salarie = 'salarie',
	ChoixDuStatut = 'choix_du_statut',
}
