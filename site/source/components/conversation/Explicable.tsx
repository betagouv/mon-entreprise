import { DottedName } from 'modele-social'
import { useContext } from 'react'

import { EngineContext } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import ButtonHelp from '@/design-system/buttons/ButtonHelp'
import { H3 } from '@/design-system/typography/heading'

import { References } from '../References'

export function ExplicableRule<Names extends string = DottedName>({
	dottedName,
	light,
	bigPopover,
	...props
}: {
	dottedName: Names
	light?: boolean
	bigPopover?: boolean
}) {
	const engine = useContext(EngineContext)

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) {
		return null
	}
	const rule = engine.getRule(dottedName)

	if (rule.rawNode.description == null) {
		return null
	}

	// TODO montrer les variables de type 'une possibilité'

	return (
		<ButtonHelp
			key={rule.dottedName}
			type="info"
			title={rule.title}
			light={light}
			bigPopover={bigPopover}
			className="print-hidden"
			aria-haspopup="dialog"
			{...props}
		>
			<Markdown>{rule.rawNode.description}</Markdown>
			{rule.rawNode.références && (
				<>
					<H3>Liens utiles</H3>
					<References references={rule.rawNode.références} />
				</>
			)}
		</ButtonHelp>
	)
}
