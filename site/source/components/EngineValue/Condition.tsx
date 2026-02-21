import { useEngine } from '../utils/EngineContext'
import { ConditionProps } from './types'

/**
 * Utilisation :
 *
 * <Condition expression={expression Publicodes}>
 * 	{ children }
 * </Condition>
 * Les enfants seront rendus si l'expression est vraie.
 * Exemple : <Condition expression={salarié . cotisations > 0}>
 *
 * <Condition non expression={expression Publicodes}>
 * 	{ children }
 * </Condition>
 * Les enfants seront rendus si l'expression est fausse.
 * Exemple : <Condition non expression={salarié . cotisations > 0}>
 * Cet exemple est équivalent à <Condition expression={salarié . cotisations <= 0}>
 * mais cette propriété est utile lorsque la condition d'affichage est du type
 * "toujours sauf toutes ces conditions" qui se traduit en Publicodes par
 * "toutes ces conditions" != oui
 */
export function Condition({
	expression,
	children,
	engine: engineFromProps,
	contexte = {}, // TODO: remplacer par undefined ? Voir #4323
	non = false,
}: ConditionProps) {
	const defaultEngine = useEngine()
	const engine = engineFromProps ?? defaultEngine
	const nodeValue = engine.evaluate({
		'!=': [expression, non ? 'oui' : 'non'],
		contexte,
	}).nodeValue

	if (!nodeValue) {
		return null
	}

	return <>{children}</>
}
