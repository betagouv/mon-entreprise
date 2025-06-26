import { Entreprise } from './Entreprise'

export interface EntreprisesRepository {
	rechercheTexteLibre: (
		termeDeRecherche: string
	) => Promise<Array<Entreprise> | null>
}
