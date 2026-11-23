import { AvailableLang } from '@/locales/langue'
import { alternatePathname } from '@/sitePaths'
import { isNotNull } from '@/utils'

type MatchPath = (
	motif: string,
	chemin: string
) => { params: Record<string, string> } | null

type GeneratePath = (motif: string, params?: Record<string, string>) => string

const cheminsAlternatifs = alternatePathname()

const cheminsAlternatifsParamétrés = (
	langue: AvailableLang,
	chemin: string,
	matchPath: MatchPath,
	generatePath: GeneratePath
) =>
	Object.entries(cheminsAlternatifs[langue])
		.filter(([motif]) => /\/:/.test(motif))
		.map(([motif, alternatif]) => {
			const correspondance = matchPath(motif, chemin)

			return correspondance && generatePath(alternatif, correspondance.params)
		})
		.filter(isNotNull)

export const lienVersLAutreLangue = ({
	urlDeLAutreLangue,
	langue,
	chemin,
	matchPath,
	generatePath,
}: {
	urlDeLAutreLangue: string
	langue: AvailableLang
	chemin: string
	matchPath: MatchPath
	generatePath: GeneratePath
}): string =>
	urlDeLAutreLangue
		? urlDeLAutreLangue +
			(cheminsAlternatifs[langue][chemin] ??
				cheminsAlternatifsParamétrés(
					langue,
					chemin,
					matchPath,
					generatePath
				)[0] ??
				'/')
		: ''
