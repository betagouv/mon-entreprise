import { useEngine } from '@/utils/publicodes/EngineContext'

import { ConditionProps } from './types'

export function Condition({
	expression,
	children,
	engine: engineFromProps,
	contexte = {},
}: ConditionProps) {
	const defaultEngine = useEngine()
	const engine = engineFromProps ?? defaultEngine
	const nodeValue = engine.evaluate({
		'!=': [expression, 'non'],
		contexte,
	}).nodeValue

	if (!nodeValue) {
		return null
	}

	return <>{children}</>
}
