import { useSelector } from 'react-redux'

import { SmallBody, Spacing, Strong } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import Value from '../EngineValue/Value'
import { Appear } from '../ui/animate'

export function DefaultValue({
	dottedName,
}: {
	dottedName: DottedName
	id?: string
}) {
	const engine = useEngine()
	const showDefaultValue =
		!(dottedName in useSelector(situationSelector)) &&
		// eslint-disable-next-line eqeqeq
		engine.evaluate(dottedName).nodeValue != undefined

	return (
		<>
			<Appear unless={showDefaultValue}>
				{showDefaultValue && (
					<SmallBody style={{ marginBottom: 0 }} $grey>
						Choix par défaut :{' '}
						<Strong>
							<Value expression={dottedName} linkToRule={false} />
						</Strong>
					</SmallBody>
				)}
			</Appear>
			<Spacing md />
		</>
	)
}
