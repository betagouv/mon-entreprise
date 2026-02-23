import { NomModèle } from '@/domaine/SimulationConfig'
import { useSitePaths } from '@/sitePaths'

export const useDocumentationPath = (nomModèle?: NomModèle) => {
	const { absoluteSitePaths } = useSitePaths()
	const path = absoluteSitePaths.documentation.index

	if (nomModèle && nomModèle !== 'modele-social') {
		return `${path}/${nomModèle}`
	}

	return path
}
