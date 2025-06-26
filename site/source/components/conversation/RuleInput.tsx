import * as O from 'effect/Option'
import { DottedName } from 'modele-social'
import Engine, { Evaluation } from 'publicodes'
import { useDispatch } from 'react-redux'

import {
	getMultiplePossibilitiesOptions,
	isMultiplePossibilities,
} from '@/components/conversation/getMultiplePossibilitiesOptions'
import {
	getOnePossibilityOptions,
	isOnePossibility,
} from '@/components/conversation/getOnePossibilityOptions'
import { useEngine } from '@/components/utils/EngineContext'
import {
	ChoiceDisplayType,
	InputSuggestionsRecord,
	MontantField,
	NumberField,
	QuantitéField,
	Spacing,
	type DateFieldProps,
} from '@/design-system'
import { isIsoDate } from '@/domaine/Date'
import { estUneUnitéDeMontantPublicodes } from '@/domaine/engine/MontantAdapter'
import {
	decodeSuggestions,
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isMontant, Montant } from '@/domaine/Montant'
import { OuiNon } from '@/domaine/OuiNon'
import { isQuantité, Quantité } from '@/domaine/Quantité'
import { enregistreLesRéponses } from '@/store/actions/actions'
import { getMeta } from '@/utils/publicodes'

import { normalizeRuleName } from '../utils/normalizeRuleName'
import { DateInput } from './DateInput'
import { DefaultValue } from './DefaultValue'
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
		value: ValeurPublicodes | undefined,
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

	className?: string
	autoFocus?: boolean
	small?: boolean

	formatOptions?: Intl.NumberFormatOptions
	displayedUnit?: string

	id?: string
	'aria-labelledby'?: string
	'aria-label'?: string
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
	const dispatch = useDispatch()
	const defaultEngine = useEngine() as Engine<string>

	const engineValue = (engine ?? defaultEngine) as Engine<DottedName>
	const rule = engineValue.getRule(dottedName)
	const evaluation = engineValue.evaluate({ valeur: dottedName, ...modifiers })

	const isDefaultValue = missing ?? dottedName in evaluation.missingVariables

	const decoded: O.Option<ValeurPublicodes> =
		PublicodesAdapter.decode(evaluation)

	const value = isDefaultValue ? undefined : O.getOrUndefined(decoded)
	const defaultValue = isDefaultValue ? O.getOrUndefined(decoded) : undefined

	const suggestions = decodeSuggestions(rule.suggestions, engineValue)

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
					defaultValue={defaultValue}
					onChange={(value) => onChange(value, dottedName)}
					missing={missing ?? dottedName in evaluation.missingVariables}
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
					onChange={(c) => {
						dispatch(enregistreLesRéponses(dottedName, c))
					}}
					value={value as Evaluation<string>}
				/>
				<Spacing md />
			</>
		)
	}

	// Utilisation dans l'assistant demande de mobilité internationale
	// si réponse "non" à "Allez-vous exercer une activité dans un seul et unique pays ?""
	if (rule.rawNode.API && rule.rawNode.API.startsWith('pays détachement')) {
		return (
			<>
				<SelectPaysDétachement
					id={inputId}
					value={value as Evaluation<string>}
					onChange={(value) => onChange(value as ValeurPublicodes, dottedName)}
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
				onChange={(value) =>
					onChange(
						value === undefined ? undefined : parseInt(value),
						dottedName
					)
				}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={accessibilityProps.autoFocus}
				onSubmit={onSubmit}
			/>
		)
	}

	// Gestion des entrées de date
	if ((rule.rawNode.type as string | undefined)?.startsWith('date') /* 😭 */) {
		return (
			<DateInput
				dottedName={rule.dottedName}
				value={isIsoDate(value) ? value : undefined}
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
					value={value as 'oui' | 'non' | undefined}
					onChange={(value) => onChange(value, dottedName)}
					defaultValue={defaultValue as OuiNon | undefined}
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
				aria={{
					labelledby: accessibilityProps['aria-labelledby'],
					label: accessibilityProps['aria-label'],
				}}
			/>
		)
	}

	const estUnMontant =
		(value && isMontant(value)) ||
		(defaultValue && isMontant(defaultValue)) ||
		estUneUnitéDeMontantPublicodes(rule.rawNode.unité)

	if (estUnMontant) {
		return (
			<MontantField
				value={value as Montant | undefined}
				placeholder={defaultValue as Montant | undefined}
				unité={'Euro'} // FIXME détecter correctement l’unité
				onChange={(value) => {
					onChange(value, dottedName)
				}}
				onSubmit={onSubmit}
				suggestions={
					showSuggestions ? (suggestions as Record<string, Montant>) : {}
				}
				id={inputId}
				aria={{
					labelledby: accessibilityProps['aria-labelledby'],
					label: accessibilityProps['aria-label'] ?? rule.title,
				}}
			/>
		)
	}

	const estUneQuantité =
		(value && isQuantité(value)) || (defaultValue && isQuantité(defaultValue))

	if (estUneQuantité) {
		const quantitéValue = value as Quantité | undefined
		const quantitéPlaceholder = defaultValue as Quantité | undefined

		return (
			<QuantitéField
				value={quantitéValue}
				unité={quantitéValue?.unité || quantitéPlaceholder?.unité || ''}
				onChange={(value) => {
					onChange(value, dottedName)
				}}
				placeholder={quantitéPlaceholder}
				onSubmit={onSubmit}
				suggestions={
					showSuggestions
						? (suggestions as Record<string, Quantité>)
						: undefined
				}
				id={inputId}
				aria={{
					labelledby: accessibilityProps['aria-labelledby'],
					label: accessibilityProps['aria-label'] ?? rule.title,
				}}
			/>
		)
	}

	return (
		<NumberField
			value={value as number | undefined}
			placeholder={defaultValue as number | undefined}
			onChange={(value) => {
				onChange(value, dottedName)
			}}
			onSubmit={onSubmit}
			suggestions={
				showSuggestions
					? (suggestions as InputSuggestionsRecord<number>)
					: undefined
			}
			id={inputId}
			formatOptions={accessibilityProps.formatOptions}
			aria={{
				labelledby: accessibilityProps['aria-labelledby'],
				label: accessibilityProps['aria-label'] ?? rule.title,
			}}
		/>
	)
}
