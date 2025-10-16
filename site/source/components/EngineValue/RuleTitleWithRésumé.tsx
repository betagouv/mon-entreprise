import { useEngine } from '@/components/utils/EngineContext'
import { Strong } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

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
