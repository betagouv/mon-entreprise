import { DottedName } from 'modele-social'

import { useEngine } from '@/components/utils/EngineContext'
import { Strong } from '@/design-system'

export default function RuleTitleWithRésumé({
	dottedName,
}: {
	dottedName: DottedName
}) {
	const rule = useEngine().getRule(dottedName)

	return (
		<>
			<Strong>{rule.title}</Strong>
			<p>{rule.rawNode.résumé}</p>
		</>
	)
}
