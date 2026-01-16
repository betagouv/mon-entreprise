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
	defaultValue: ValeurPublicodes | undefined
	choices: Choice
	onChange?: (value: ValeurPublicodes | undefined) => void
	missing?: boolean
	onSubmit?: (source?: string) => void
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean
	variant?: ChoiceDisplayType
	aria?: {
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
	defaultValue,
	choices,
	onChange = NoOp,
	id,
	title,
	description,
	autoFocus,
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
			isDefaultSelected: defaultValue === value,
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
			isDefaultSelected: defaultValue === value,
		}
	})

	const valueAsString = isMontant(currentSelection)
		? montantToString(currentSelection)
		: currentSelection?.toString()

	const defaultValueAsString = isMontant(defaultValue)
		? montantToString(defaultValue)
		: defaultValue?.toString()

	return (
		<ChoixUnique
			value={valueAsString}
			defaultValue={defaultValueAsString}
			options={options}
			onChange={handleChange}
			id={id}
			title={title}
			description={description}
			/* eslint-disable-next-line jsx-a11y/no-autofocus */
			autoFocus={autoFocus}
			variant={variant}
			aria={aria}
		/>
	)
}
