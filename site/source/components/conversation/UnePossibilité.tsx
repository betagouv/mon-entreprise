import { DottedName } from 'modele-social'
import { EvaluatedNode, PublicodesExpression } from 'publicodes'

import { Choice } from '@/components/conversation/Choice'
import { ChoiceDisplayType } from '@/design-system/field/ChoiceGroup'
import { ChoixUnique, SimpleChoiceOption } from '@/design-system/field/choix'
import { relativeDottedName } from '@/domaine/relativeDottedName'
import { useSelection } from '@/hooks/UseSelection'

export type { ChoiceDisplayType } from '@/design-system/field/ChoiceGroup'

interface UnePossibilitéProps {
	dottedName: DottedName
	value: EvaluatedNode['nodeValue']
	choices: Choice
	onChange: (value: PublicodesExpression | undefined) => void
	missing?: boolean
	onSubmit?: (source?: string) => void
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean
	variant?: ChoiceDisplayType
	aria?: {
		label?: string
		labelledby?: string
	}
}

/**
 * Composant pour les questions à choix unique dans Publicodes
 * Adapté pour utiliser le composant UI ChoixUnique
 */
export const UnePossibilité = ({
	dottedName,
	value,
	choices,
	onChange,
	missing,
	onSubmit,
	id,
	title,
	description,
	autoFocus,
	variant = 'radio',
	aria,
}: UnePossibilitéProps) => {
	const { handleChange, defaultValue, currentSelection } = useSelection({
		dottedName,
		value,
		onChange,
		missing,
		onSubmit,
		id,
	})

	// Convertir les données spécifiques à Publicodes en format pour le composant UI
	const options: SimpleChoiceOption[] = choices.children.map((node) => {
		const relativeValue = relativeDottedName(dottedName, node.dottedName)
		const formattedValue = `'${relativeValue}'`

		return {
			value: formattedValue,
			label: node.title,
			description: node.rawNode.description,
			emoji: node.rawNode.icônes,
			isDefaultSelected: defaultValue === formattedValue,
		}
	})

	return (
		<ChoixUnique
			value={currentSelection || undefined}
			options={options}
			onChange={handleChange}
			onSubmit={onSubmit}
			id={id}
			title={title}
			description={description}
			/* eslint-disable-next-line jsx-a11y/no-autofocus */
			autoFocus={autoFocus}
			variant={variant}
			defaultValue={defaultValue}
			aria={aria}
		/>
	)
}
