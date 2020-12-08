import { RuleLinkWithContext } from '../RuleLink'

export default function SynchronisationMecanism({ explanation }) {
	return (
		<p>
			Obtenu à partir de la saisie{' '}
			<RuleLinkWithContext dottedName={explanation.data.dottedName} />
		</p>
	)
}
