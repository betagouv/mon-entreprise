import { useSitePaths } from '../sitePaths'
import { useCurrentSimulatorMetadata } from './useCurrentSimulatorMetadata'
import { useIsEmbedded } from './useIsEmbedded'

type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`
}[keyof ObjectType & (string | number)]

type SitePathsNode =
	| string
	| { index?: string; [key: string]: SitePathsNode | undefined }

const trouveLeChemin = (
	objetAExplorer: SitePathsNode,
	chemin: string[]
): string => {
	if (chemin.length === 0) {
		return typeof objetAExplorer === 'string'
			? objetAExplorer
			: objetAExplorer.index || ''
	}

	if (typeof objetAExplorer === 'string') {
		throw new Error(
			`Navigation invalide: tentative de navigation dans une string`
		)
	}

	const [head, ...tail] = chemin
	const nextObj = objetAExplorer[head]

	if (!nextObj) {
		throw new Error(`Chemin invalide: ${head}`)
	}

	return trouveLeChemin(nextObj, tail)
}

export const useGetPath = () => {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const isEmbedded = useIsEmbedded()
	const { currentSimulatorMetadata } = useCurrentSimulatorMetadata()

	return (sitePath: NestedKeyOf<typeof relativeSitePaths>): string => {
		if (!currentSimulatorMetadata) {
			throw new Error(
				'useGetPath doit être utilisé dans un contexte de simulateur/assistant'
			)
		}

		const cheminComplet = trouveLeChemin(absoluteSitePaths, sitePath.split('.'))

		const cheminDeBaseDeLAssistant = trouveLeChemin(
			absoluteSitePaths,
			currentSimulatorMetadata.pathId.split('.')
		)

		return isEmbedded && currentSimulatorMetadata.iframePath
			? cheminComplet.replace(
					cheminDeBaseDeLAssistant,
					`/iframes/${currentSimulatorMetadata.iframePath}`
			  )
			: cheminComplet
	}
}
