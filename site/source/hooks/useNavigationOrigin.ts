import { usePersistingState } from '@/components/utils/persistState'

export type NavigationOrigin = {
	fromGérer?: boolean
	fromCréer?: boolean
	fromSimulateurs?: boolean
}

const STORAGE_KEY = 'navigation::simulateurs::locationState::v2'

/**
 * Hook pour gérer l'origine de navigation vers les simulateurs.
 * Permet d'afficher le bon lien "retour" selon d'où vient l'utilisateur.
 */
export function useNavigationOrigin() {
	return usePersistingState<NavigationOrigin>(STORAGE_KEY, {})
}
