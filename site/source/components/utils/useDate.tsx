import { useEngine } from './EngineContext'

export default function useDate() {
	const date = useEngine().evaluate('date')

	return date.nodeValue
}
