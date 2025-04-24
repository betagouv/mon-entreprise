import { DottedName } from 'modele-social'
import Engine, { Evaluation, PublicodesExpression } from 'publicodes'

import {
	getMultiplePossibilitiesOptions,
	isMultiplePossibilities,
} from '@/components/conversation/getMultiplePossibilitiesOptions'
import {
	getOnePossibilityOptions,
	isOnePossibility,
} from '@/components/conversation/getOnePossibilityOptions'
import { useEngine } from '@/components/utils/EngineContext'
import { ChoiceDisplayType } from '@/design-system/field/ChoiceGroup'
import { DateFieldProps } from '@/design-system/field/DateField'
import { Spacing } from '@/design-system/layout'
import { getMeta } from '@/utils/publicodes'

import { normalizeRuleName } from '../utils/normalizeRuleName'
import { DateInput } from './DateInput'
import { DefaultValue } from './DefaultValue'
import NumberInput from './NumberInput'
import { OuiNonInput } from './OuiNonInput'
import { PlusieursPossibilités } from './PlusieursPossibilités'
import SelectCommune from './select/SelectCommune'
import SelectPaysDétachement from './select/SelectPaysDétachement'
import SelectAtmp from './select/SelectTauxRisque'
import TextInput from './TextInput'
import { UnePossibilité } from './UnePossibilité'

interface RuleInputProps {
	dottedName: DottedName
	onChange: (
		value: PublicodesExpression | undefined,
		dottedName: DottedName
	) => void

	missing?: boolean
	onSubmit?: (source?: string) => void
	engine?: Engine<DottedName>
	showSuggestions?: boolean
	hideDefaultValue?: boolean
	inputType?: ChoiceDisplayType
	modifiers?: Record<string, string>
	required?: boolean

	id?: string
	'aria-labelledby'?: string
	'aria-label'?: string
	className?: string
	autoFocus?: boolean
	small?: boolean

	formatOptions?: Intl.NumberFormatOptions
	displayedUnit?: string
}

export const binaryQuestion = [
	{ value: 'oui', label: 'Oui' },
	{ value: 'non', label: 'Non' },
] as const

/**
 * RuleInput - Composant de routage d'une question Publicodes
 *
 * Ce composant analyse une règle Publicodes et détermine le composant d'entrée approprié
 * à afficher en fonction du type de règle et des métadonnées associées.
 */
export default function RuleInput({
	dottedName,
	onChange,
	showSuggestions = true,
	onSubmit = () => null,
	hideDefaultValue = false,
	missing,
	inputType,
	modifiers = {},
	engine,
	...accessibilityProps
}: RuleInputProps) {
	const defaultEngine = useEngine() as Engine<string>
	const engineValue = (engine ?? defaultEngine) as Engine<DottedName>
	const rule = engineValue.getRule(dottedName)
	const evaluation = engineValue.evaluate({ valeur: dottedName, ...modifiers })
	const value = evaluation.nodeValue

	const inputId = accessibilityProps?.id ?? normalizeRuleName.Input(dottedName)

	const meta = getMeta<{ affichage?: string }>(rule.rawNode, {})

	if (isMultiplePossibilities(engineValue, dottedName)) {
		return (
			<>
				<PlusieursPossibilités
					value={value}
					choices={getMultiplePossibilitiesOptions(engineValue, dottedName)}
					onChange={onChange}
					engine={engineValue}
					id={inputId}
					title={rule.title}
					description={rule.rawNode.description}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={accessibilityProps.autoFocus}
					onSubmit={onSubmit}
					suggestions={showSuggestions ? rule.suggestions : {}}
					aria={{
						labelledby: accessibilityProps['aria-labelledby'],
						label: accessibilityProps['aria-label'],
					}}
				/>
				<Spacing md />
			</>
		)
	}

	if (isOnePossibility(engineValue.getRule(dottedName))) {
		const type =
			inputType ??
			(meta.affichage &&
			['radio', 'card', 'toggle', 'select'].includes(meta.affichage)
				? (meta.affichage as ChoiceDisplayType)
				: 'radio')

		return (
			<>
				<UnePossibilité
					dottedName={dottedName}
					value={value}
					onChange={(value) => onChange(value, dottedName)}
					missing={missing ?? dottedName in evaluation.missingVariables}
					onSubmit={onSubmit}
					id={inputId}
					title={rule.title}
					description={rule.rawNode.description}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={accessibilityProps.autoFocus}
					choices={getOnePossibilityOptions(engineValue, dottedName)}
					variant={type}
					aria={{
						labelledby: accessibilityProps['aria-labelledby'],
						label: accessibilityProps['aria-label'],
					}}
				/>
				{!hideDefaultValue && <DefaultValue dottedName={dottedName} />}
			</>
		)
	}

	// Gestion des API spécifiques
	if (rule.rawNode.API && rule.rawNode.API === 'commune') {
		return (
			<>
				<SelectCommune
					id={inputId}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={accessibilityProps.autoFocus}
					missing={missing ?? dottedName in evaluation.missingVariables}
					onChange={(c) => onChange({ batchUpdate: c }, dottedName)}
					value={value as Evaluation<string>}
				/>
				<Spacing md />
			</>
		)
	}

	if (rule.rawNode.API && rule.rawNode.API.startsWith('pays détachement')) {
		return (
			<>
				<SelectPaysDétachement
					id={inputId}
					value={value}
					onChange={(value) => onChange(value, dottedName)}
					plusFrance={rule.rawNode.API.endsWith('plus France')}
				/>
				<Spacing md />
			</>
		)
	}

	if (rule.rawNode.API) {
		throw new Error(
			"Les seules API implémentées sont 'commune' et 'pays détachement'"
		)
	}

	// Cas spécifique pour ATMP
	if (rule.dottedName === 'établissement . taux ATMP . taux collectif') {
		return (
			<SelectAtmp
				onChange={(value) => onChange(value, dottedName)}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={accessibilityProps.autoFocus}
				onSubmit={onSubmit}
			/>
		)
	}

	// Gestion des entrées de date
	if ((rule.rawNode.type as string | undefined)?.startsWith('date')) {
		return (
			<DateInput
				value={value}
				onChange={(value) => onChange(value, dottedName)}
				missing={missing ?? dottedName in evaluation.missingVariables}
				title={rule.title}
				hideDefaultValue={hideDefaultValue}
				onSubmit={onSubmit}
				suggestions={showSuggestions ? rule.suggestions : {}}
				aria={{
					labelledby: accessibilityProps['aria-labelledby'],
					label: accessibilityProps['aria-label'],
				}}
				type={rule.rawNode.type as DateFieldProps['type']}
			/>
		)
	}

	if (
		evaluation.unit == null &&
		['booléen', 'notification', undefined].includes(
			rule.rawNode.type as string
		) &&
		typeof evaluation.nodeValue !== 'number'
	) {
		return (
			<>
				<OuiNonInput
					value={
						value === true
							? true
							: value === false
							? false
							: value === 'oui'
							? 'oui'
							: value === 'non'
							? 'non'
							: undefined
					}
					onChange={(value) => onChange(value, dottedName)}
					defaultValue={
						value === true ? 'oui' : value === false ? 'non' : undefined
					}
					onSubmit={onSubmit}
					id={inputId}
					title={rule.title}
					description={rule.rawNode.description}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={accessibilityProps.autoFocus}
					aria={{
						labelledby: accessibilityProps['aria-labelledby'],
						label: accessibilityProps['aria-label'],
					}}
				/>
				{!hideDefaultValue && <DefaultValue dottedName={dottedName} />}
			</>
		)
	}

	if (rule.rawNode.type === 'texte') {
		return (
			<TextInput
				value={value}
				onChange={(value) => onChange(value, dottedName)}
				missing={missing ?? dottedName in evaluation.missingVariables}
				title={rule.title}
				description={rule.rawNode.description}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={accessibilityProps.autoFocus}
				onSubmit={onSubmit}
				suggestions={showSuggestions ? rule.suggestions : {}}
				aria={{
					labelledby: accessibilityProps['aria-labelledby'],
					label: accessibilityProps['aria-label'],
				}}
			/>
		)
	}

	return (
		<NumberInput
			value={value}
			onChange={(value) => onChange(value, dottedName)}
			missing={missing ?? dottedName in evaluation.missingVariables}
			onSubmit={onSubmit}
			suggestions={showSuggestions ? rule.suggestions : {}}
			showSuggestions={showSuggestions}
			unit={evaluation.unit}
			id={inputId}
			description={rule.rawNode.description}
			formatOptions={accessibilityProps.formatOptions}
			displayedUnit={accessibilityProps.displayedUnit}
			aria={{
				labelledby: accessibilityProps['aria-labelledby'],
				label: accessibilityProps['aria-label'] ?? rule.title,
			}}
		/>
	)
}
