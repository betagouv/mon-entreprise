import { NomModèle } from '@/domaine/SimulationConfig'
import { useSitePaths } from '@/sitePaths'

export const useDocumentationPath = (nomModèle?: NomModèle) => {
	const { absoluteSitePaths } = useSitePaths()
	let path = absoluteSitePaths.documentation.index

	if (nomModèle && nomModèle !== 'modele-social') {
		path += `/${nomModèle}`
	}

	return path
}
