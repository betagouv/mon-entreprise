import { useEngine } from '../utils/EngineContext'
import { ConditionProps } from './types'

export function Condition({
	expression,
	children,
	engine: engineFromProps,
}: ConditionProps) {
	const defaultEngine = useEngine()
	const engine = engineFromProps ?? defaultEngine
	const nodeValue = engine.evaluate({ '!=': [expression, 'non'] }).nodeValue

	if (!nodeValue) {
		return null
	}

	return <>{children}</>
}
