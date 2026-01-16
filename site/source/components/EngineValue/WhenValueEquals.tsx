import { useEngine } from '@/utils/publicodes/EngineContext'

import { ConditionProps } from './types'

export function WhenValueEquals({
	expression,
	value,
	children,
	engine: engineFromProps,
}: ConditionProps & { value: string | number }) {
	const defaultEngine = useEngine()
	const engine = engineFromProps ?? defaultEngine
	const nodeValue = engine.evaluate(expression).nodeValue

	if (nodeValue !== value) {
		return null
	}

	return <>{children}</>
}
