import * as O from 'effect/Option'
import Engine, { Evaluation } from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'

import {
	getMultiplePossibilitiesOptions,
	isMultiplePossibilities,
} from '@/components/conversation/getMultiplePossibilitiesOptions'
import {
	getOnePossibilityOptions,
	isOnePossibility,
} from '@/components/conversation/getOnePossibilityOptions'
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
import {
	decodeArrondi,
	decodeSuggestions,
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isMontant, Montant } from '@/domaine/Montant'
import { OuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { isQuantité, Quantité } from '@/domaine/Quantité'
import {
	isUnitéMonétaire,
	isUnitéMonétaireRécurrente,
	isUnitéQuantité,
	UnitéMonétaire,
	UnitéQuantité,
} from '@/domaine/Unités'
import { useEngine } from '@/hooks/useEngine'
import { enregistreLesRéponsesÀLaQuestion } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { getMeta } from '@/utils/publicodes/publicodes'

import { normalizeRuleName } from '../utils/normalizeRuleName'
import { DateInput } from './DateInput'
import { DefaultValue } from './DefaultValue'
import { OuiNonInput } from './OuiNonInput'
import { PlusieursPossibilités } from './PlusieursPossibilités'
import SelectCommune from './select/SelectCommune'
import SelectAtmp from './select/SelectTauxRisque'
import TextInput from './TextInput'
import { UnePossibilité } from './UnePossibilité'

export const PLUSIEURS_POSSIBILITES = 'PlusieursPossibilités'
export const UNE_POSSIBILITE = 'UnePossibilité'
export const OUI_NON_INPUT = 'OuiNonInput'
const SELECT_COMMUNE = 'SelectCommune'
const NON_EXISTING_API = 'NonExistingAPI'
const SELECT_ATMP = 'SelectAtmp'
const DATE_INPUT = 'DateInput'
const TEXT_INPUT = 'TextInput'
const MONTANT_FIELD = 'MontantField'
const QUANTITE_FIELD = 'QuantitéField'
const NUMBER_FIELD = 'NumberField'

export const binaryQuestion = [
	{ value: 'oui', label: 'Oui' },
	{ value: 'non', label: 'Non' },
] as const

type RuleInputNature =
	| typeof PLUSIEURS_POSSIBILITES
	| typeof UNE_POSSIBILITE
	| typeof OUI_NON_INPUT
	| typeof SELECT_COMMUNE
	| typeof NON_EXISTING_API
	| typeof SELECT_ATMP
	| typeof DATE_INPUT
	| typeof TEXT_INPUT
	| typeof MONTANT_FIELD
	| typeof QUANTITE_FIELD
	| typeof NUMBER_FIELD

export function getRuleInputNature(
	dottedName: DottedName,
	engine: Engine<DottedName>,
	modifiers: Record<string, string>,
	estUnMontant: boolean,
	estUneQuantité: boolean
): RuleInputNature {
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({ valeur: dottedName, ...modifiers })

	if (isMultiplePossibilities(engine, dottedName)) return PLUSIEURS_POSSIBILITES

	if (isOnePossibility(engine.getRule(dottedName))) return UNE_POSSIBILITE

	if (rule.rawNode.API === 'commune') return SELECT_COMMUNE

	if (rule.rawNode.API) return NON_EXISTING_API

	if (rule.dottedName === 'établissement . taux ATMP . taux collectif')
		return SELECT_ATMP

	if ((rule.rawNode.type as string | undefined)?.startsWith('date')) {
		return DATE_INPUT
	}

	if (
		evaluation.unit == null &&
		['booléen', 'notification', undefined].includes(
			rule.rawNode.type as string
		) &&
		typeof evaluation.nodeValue !== 'number'
	)
		return OUI_NON_INPUT

	if (rule.rawNode.type === 'texte') return TEXT_INPUT

	if (estUnMontant) return MONTANT_FIELD

	if (estUneQuantité) return QUANTITE_FIELD

	return NUMBER_FIELD
}

/**
 * RuleInput - Composant de routage d'une question Publicodes
 *
 * Ce composant analyse une règle Publicodes et détermine le composant d'entrée approprié
 * à afficher en fonction du type de règle et des métadonnées associées.
 */
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
	small,
	displayedUnit,
	...accessibilityProps
}: RuleInputProps) {
	const dispatch = useDispatch()
	const defaultEngine = useEngine() as Engine<string>

	const engineValue = (engine ?? defaultEngine) as Engine<DottedName>
	const rule = engineValue.getRule(dottedName)
	const evaluation = engineValue.evaluate({ valeur: dottedName, ...modifiers })

	const targetUnit = useSelector(targetUnitSelector)

	const isDefaultValue = missing ?? dottedName in evaluation.missingVariables

	const decoded: O.Option<ValeurPublicodes> =
		PublicodesAdapter.decode(evaluation)

	const value = isDefaultValue ? undefined : O.getOrUndefined(decoded)
	const defaultValue = isDefaultValue ? O.getOrUndefined(decoded) : undefined

	const unitéPublicodes = rule.rawNode.unité
	const nbDécimalesMax = decodeArrondi(rule.rawNode.arrondi as string)

	const estUnMontant = Boolean(
		(value && isMontant(value)) ||
			(defaultValue && isMontant(defaultValue)) ||
			isUnitéMonétaire(unitéPublicodes)
	)

	const estUneQuantité = Boolean(
		(value && isQuantité(value)) ||
			(defaultValue && isQuantité(defaultValue)) ||
			isUnitéQuantité(unitéPublicodes)
	)

	const inputNature = getRuleInputNature(
		dottedName,
		engineValue,
		modifiers,
		estUnMontant,
		estUneQuantité
	)

	const suggestions = decodeSuggestions(rule.suggestions, engineValue)

	const inputId = accessibilityProps?.id ?? normalizeRuleName.Input(dottedName)

	const meta = getMeta<{ affichage?: string }>(rule.rawNode, {})

	if (inputNature === PLUSIEURS_POSSIBILITES) {
		return (
			<>
				<PlusieursPossibilités
					règle={dottedName}
					onChange={(choixSélectionnés: DottedName[]) => {
						const toutesLesPossibilités = getMultiplePossibilitiesOptions(
							engineValue,
							dottedName
						)
						const valeurs = toutesLesPossibilités.reduce<
							Record<string, OuiNon>
						>((acc, possibilité) => {
							const suffixe = possibilité.dottedName.replace(
								`${dottedName} . `,
								''
							)

							return {
								...acc,
								[suffixe]: choixSélectionnés.includes(possibilité.dottedName)
									? 'oui'
									: 'non',
							}
						}, {})

						dispatch(enregistreLesRéponsesÀLaQuestion(dottedName, valeurs))
					}}
					engine={engineValue}
					id={inputId}
					aria={{
						labelledby: accessibilityProps['aria-labelledby'],
						label: accessibilityProps['aria-label'],
					}}
				/>
				<Spacing md />
			</>
		)
	}

	if (inputNature === UNE_POSSIBILITE) {
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
	if (inputNature === SELECT_COMMUNE) {
		return (
			<>
				<SelectCommune
					id={inputId}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={accessibilityProps.autoFocus}
					missing={missing ?? dottedName in evaluation.missingVariables}
					onChange={(c) => {
						dispatch(enregistreLesRéponsesÀLaQuestion(dottedName, c))
					}}
					value={value as Evaluation<string>}
				/>
				<Spacing md />
			</>
		)
	}

	if (inputNature === NON_EXISTING_API) {
		throw new Error(
			"Les seules API implémentées sont 'commune' et 'pays détachement'"
		)
	}

	// Cas spécifique pour ATMP
	if (inputNature === SELECT_ATMP) {
		return (
			<SelectAtmp
				id={inputId}
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
	if (inputNature === DATE_INPUT) {
		return (
			<DateInput
				id={inputId}
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

	if (inputNature === OUI_NON_INPUT) {
		return (
			<>
				<OuiNonInput
					id={inputId}
					value={value as 'oui' | 'non' | undefined}
					onChange={(value) => onChange(value, dottedName)}
					defaultValue={defaultValue as OuiNon | undefined}
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

	if (inputNature === TEXT_INPUT) {
		return (
			<TextInput
				id={inputId}
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

	if (inputNature === MONTANT_FIELD) {
		const montantValue = value as Montant | undefined
		const montantPlaceholder = defaultValue as Montant | undefined
		const unitéDeBase =
			montantValue?.unité || montantPlaceholder?.unité || unitéPublicodes
		const unitéConvertie =
			isUnitéMonétaireRécurrente(unitéDeBase) && isUnitéMonétaire(targetUnit)
				? targetUnit
				: unitéDeBase
		const unité = isUnitéMonétaire(displayedUnit)
			? displayedUnit
			: unitéConvertie ?? undefined
		const unitéRécurrenteCible = isUnitéMonétaireRécurrente(targetUnit)
			? targetUnit
			: undefined

		return (
			<MontantField
				value={montantValue}
				placeholder={montantPlaceholder}
				unité={unité as UnitéMonétaire}
				unitéRécurrenteCible={unitéRécurrenteCible}
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
				avecCentimes={!!accessibilityProps.formatOptions?.maximumFractionDigits}
			/>
		)
	}

	if (inputNature === QUANTITE_FIELD) {
		const quantitéValue = value as Quantité | undefined
		const quantitéPlaceholder = defaultValue as Quantité | undefined
		const unité =
			quantitéValue?.unité || quantitéPlaceholder?.unité || unitéPublicodes

		return (
			<QuantitéField
				value={quantitéValue}
				placeholder={quantitéPlaceholder}
				unité={unité as UnitéQuantité}
				nbDécimalesMax={nbDécimalesMax}
				onChange={(value) => {
					onChange(value, dottedName)
				}}
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
				small={small}
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
