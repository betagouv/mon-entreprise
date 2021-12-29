import { EngineContext } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import ButtonHelp from 'DesignSystem/buttons/ButtonHelp'
import { DottedName } from 'modele-social'
import { useContext } from 'react'

export function ExplicableRule({
	dottedName,
	light,
}: {
	dottedName: DottedName
	light?: boolean
}) {
	const engine = useContext(EngineContext)

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null
	const rule = engine.getRule(dottedName)

	if (rule.rawNode.description == null) return null

	//TODO montrer les variables de type 'une possibilité'

	return (
		<ButtonHelp
			key={rule.dottedName}
			type="info"
			title={rule.title}
			light={light}
		>
			<Markdown>{rule.rawNode.description}</Markdown>
		</ButtonHelp>
	)
}
