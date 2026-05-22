import { useEngine } from '../utils/publicodes/EngineContext'

export const useDate = () => {
	const date = useEngine().evaluate('date')

	return date.nodeValue as string
}
