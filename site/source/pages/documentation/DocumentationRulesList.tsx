import rules, { RègleModeleSocial } from 'modele-social'

import RuleLink from '@/components/RuleLink'
import { H1 } from '@/design-system'

export default function DocumentationRulesList() {
	const ruleEntries = Object.keys(rules) as RègleModeleSocial[]

	return (
		<>
			<H1>Liste des règles de modele-social</H1>
			{ruleEntries.map((name) => (
				<RuleLink dottedName={name} key={name}>
					{name}
				</RuleLink>
			))}
		</>
	)
}
