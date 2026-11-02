// Import direct de la frontière client : l'index du module agrège aussi des
// composants que Next ne peut pas charger depuis un Server Component.
import { DocumentationDuModèle } from '@/components/documentation/DocumentationDuModele'

import { métadonnéesDeRègle } from '../metadonneesDeRegle'

export const metadata = métadonnéesDeRègle

export default function Page() {
	return <DocumentationDuModèle nomModèle="modele-social" />
}
