import { Strong } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'

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
