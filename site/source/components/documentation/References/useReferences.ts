import { RuleNode } from 'publicodes'

import { useIsEmbeddedOnBPISite } from '@/hooks/useIsEmbeddedOnBPISite'

// BPI agreed to use our assistant on their website, but only if we filter the
// links to only show the ones that are relevant to their users.
// They paid the extra development cost for this feature.
const BPIWhiteList = ['bpifrance-creation.fr', 'associations.gouv.fr']

export function useReferences(rule: RuleNode) {
	const onBPISite = useIsEmbeddedOnBPISite()
	if (!rule.rawNode.références) {
		return {}
	}

	return Object.fromEntries(
		Object.entries(rule.rawNode.références).filter(([, value]) => {
			const whitelistedByBPI = BPIWhiteList.some((site) => value.includes(site))

			return onBPISite ? whitelistedByBPI : !whitelistedByBPI
		})
	)
}
