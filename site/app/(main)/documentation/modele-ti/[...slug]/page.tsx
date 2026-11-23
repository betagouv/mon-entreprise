import { DocumentationDuModèle } from '@/components/documentation'

import { métadonnéesDeRègle } from '../../metadonneesDeRegle'

export const metadata = métadonnéesDeRègle

export default function Page() {
	return <DocumentationDuModèle nomModèle="modele-ti" />
}
