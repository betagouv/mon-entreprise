import { DottedName } from 'modele-social'
import { useSelector } from 'react-redux'

import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import Value from '../EngineValue'
import { Appear } from '../ui/animate'
import { useEngine } from '../utils/EngineContext'

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
