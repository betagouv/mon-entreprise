import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { useSitePaths } from '@/hooks/useSitePaths'

export const useDocumentationPath = (nomModèle?: NomModèle) => {
	const { absoluteSitePaths } = useSitePaths()
	const path = absoluteSitePaths.documentation.index

	if (nomModèle && nomModèle !== 'modele-social') {
		return `${path}/${nomModèle}`
	}

	return path
}
