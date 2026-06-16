import { Choice, isChoice } from '@/components/conversation/Choice'
import {
	ChoiceDisplayType,
	ChoixUnique,
	SimpleChoiceOption,
	SimpleChoiceOptionWithValue,
} from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { isMontant, montantToString } from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { relativeDottedName } from '@/domaine/relativeDottedName'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

export type { ChoiceDisplayType } from '@/design-system'

interface UnePossibilitéProps {
	dottedName: DottedName
	value: ValeurPublicodes | undefined
	choices: Choice
	onChange?: (value: ValeurPublicodes | undefined) => void
	onSubmit?: (source?: string) => void
	id?: string
	title?: string
	description?: string
	variant?: ChoiceDisplayType
	aria?: {
		labelledby?: string
		describedby?: string
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
	onChange = NoOp,
	id,
	title,
	description,
	variant = 'radio',
	aria,
}: UnePossibilitéProps) => {
	const { handleChange, currentSelection } = useSelection({
		value,
		onChange,
	})

	const getSimpleChoiceOptionWithValue = (node: {
		dottedName: string
		title: string
		rawNode: {
			description?: string
			icônes?: string
		}
	}): SimpleChoiceOptionWithValue => {
		const relativeValue = relativeDottedName(dottedName, node.dottedName)

		return {
			value: relativeValue,
			label: node.title,
			description: node.rawNode.description,
			emoji: node.rawNode.icônes,
		}
	}

	const options: SimpleChoiceOption[] = choices.children.map((node) => {
		if (isChoice(node)) {
			return {
				label: node.title,
				description: node.rawNode.description,
				children: node.children.map((subChoice) =>
					getSimpleChoiceOptionWithValue(subChoice)
				),
			}
		}

		const relativeValue = relativeDottedName(dottedName, node.dottedName)

		return {
			value: relativeValue,
			label: node.title,
			description: node.rawNode.description,
			emoji: node.rawNode.icônes,
		}
	})

	const valueAsString = isMontant(currentSelection)
		? montantToString(currentSelection)
		: currentSelection?.toString()

	return (
		<ChoixUnique
			value={valueAsString}
			options={options}
			onChange={handleChange}
			id={id}
			title={title}
			description={description}
			variant={variant}
			aria={aria}
		/>
	)
}
