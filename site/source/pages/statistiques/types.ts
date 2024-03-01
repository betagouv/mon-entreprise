// Generated using app.quicktype.io

export interface StatsStruct {
	visitesJours: RawVisites
	visitesMois: RawVisites
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
	page_chapter2: string
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

interface RawVisites {
	creer: Page[]
	pages: Page[]
	site: Site[]
	api: Site[]
}

interface Site {
	date: string
	nombre: number
}

export enum PageChapter2 {
	ChoixDuStatut = 'choix_du_statut',
	CodeAPE = 'recherche_code_ape',
}

export type Satisfaction = Array<{
	date: string
	nombre: Record<SatisfactionLevel, number>
	percent?: Record<SatisfactionLevel, number>
	moyenne?: number
	total?: number
	positif?: number
	/** Number of months used to compute the average */
	nbMoisMoyenne?: number
	/** Number of reviews used to compute the average */
	nbAvisMoyenne?: number
}>
export type Visites = Array<{
	date: string
	nombre: {
		accueil: number
		simulation_commencee: number
		simulation_terminee?: number
	}
}>

export type QuestionRépondues = Array<{
	date: string
	nombre: {
		questions_répondues: number
	}
	satisfaction: number
	simulationCommencée: number
}>

export type Filter =
	| { chapter2: string; chapter3?: string }
	| 'PAM'
	| 'api-rest'

export type Pageish = Page | PageSatisfaction
