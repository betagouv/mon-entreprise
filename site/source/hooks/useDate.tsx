import { useEngine } from '../utils/publicodes/EngineContext'

export default function useDate() {
	const date = useEngine().evaluate('date')

	return date.nodeValue as string
}
