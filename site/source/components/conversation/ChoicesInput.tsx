import { DottedName } from 'modele-social'
import {
	ASTNode,
	EvaluatedNode,
	Evaluation,
	serializeEvaluation,
} from 'publicodes'
import { Fragment, Key, useCallback, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	Item,
	Radio,
	RadioCard,
	RadioCardGroup,
	RadioGroup,
	ToggleGroup,
} from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Select } from '@/design-system/field/Select'
import { Spacing } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { H3, H4 } from '@/design-system/typography/heading'

import { ExplicableRule } from './Explicable'
import { InputProps } from './RuleInput'

const relativeDottedName = (rootDottedName: string, childDottedName: string) =>
	childDottedName.replace(rootDottedName + ' . ', '')

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans
	une liste, ou une liste de listes. Les données @choices sont un arbre de type:
	- nom: motif CDD # La racine, unique, qui formera la Question. Ses enfants
	  sont les choix possibles enfants:
	  - nom: motif classique enfants:
	    - nom: motif saisonnier
	    - nom: motif remplacement
	  - nom: motif contrat aidé
	  - nom: motif complément de formation

	A chaque nom est associé une propriété 'données' contenant l'entité complète
	(et donc le titre, le texte d'aide etc.) : ce n'est pas à ce composant (une
	vue) d'aller les chercher.

*/

export type Choice = ASTNode<'rule'> & {
	children: Array<ASTNode<'rule'> | Choice>
	canGiveUp?: boolean
}

export function MultipleAnswerInput({
	choices,
	type = 'radio',
	autoFocus,
	title,
	...props
}: {
	choices: Choice
	type?: 'radio' | 'card' | 'toggle' | 'select'
} & InputProps) {
	const { t } = useTranslation()

	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)

	if (type === 'select') {
		return (
			<Select
				aria-labelledby={props['aria-labelledby'] || undefined}
				label={title}
				onSelectionChange={handleChange}
				defaultSelectedKey={defaultValue}
				selectedKey={currentSelection}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
			>
				{choices.children.map((node) => (
					<Item
						key={`'${relativeDottedName(props.dottedName, node.dottedName)}'`}
						textValue={node.title}
					>
						{node.title}
					</Item>
				))}
			</Select>
		)
	}
	if (type === 'card') {
		return (
			<RadioCardGroup
				aria-label={t(
					'conversation.multiple-answer.aria-label',
					'Choix multiples'
				)}
				onChange={handleChange}
				value={currentSelection ?? undefined}
			>
				{choices.children.map((node) => (
					<Fragment key={node.dottedName}>
						<RadioCard
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={
								autoFocus &&
								defaultValue ===
									`'${relativeDottedName(props.dottedName, node.dottedName)}'`
							}
							aria-labelledby={props['aria-labelledby'] || undefined}
							value={`'${relativeDottedName(
								props.dottedName,
								node.dottedName
							)}'`}
							label={node.title}
							emoji={node.rawNode.icônes}
							description={node.rawNode.description}
						/>
					</Fragment>
				))}
			</RadioCardGroup>
		)
	}

	const Component = type === 'radio' ? RadioGroup : ToggleGroup

	return (
		<Component
			aria-label={t(
				'conversation.multiple-answer.aria-label',
				'Choix multiples'
			)}
			{...props}
			onChange={handleChange}
			value={currentSelection ?? undefined}
			aria-labelledby={props['aria-labelledby'] || undefined}
			isRequired={props.required}
		>
			<RadioChoices
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
				defaultValue={defaultValue}
				choices={choices}
				rootDottedName={props.dottedName}
				type={type}
			/>
		</Component>
	)
}

function RadioChoices<Names extends string = DottedName>({
	choices,
	defaultValue,
	autoFocus,
	rootDottedName,
	type,
}: {
	choices: Choice
	defaultValue?: string
	autoFocus?: boolean
	rootDottedName: Names
	type: 'radio' | 'toggle'
}) {
	const { t } = useTranslation()

	return (
		<>
			{choices.children.map((node) => (
				<Fragment key={node.dottedName}>
					{' '}
					{'children' in node ? (
						<div
							role="group"
							aria-labelledby={
								node.dottedName.replace(/\s|\./g, '_') + '-legend'
							}
							id={`radio-input-${node.dottedName.replace(
								/\s|\./g,
								'_'
							)}-${rootDottedName.replace(/\s|\./g, '_')}`}
							style={{
								marginTop: '-1rem',
							}}
						>
							<H4 as={H3} id={node.dottedName + '-legend'}>
								{node.title}
							</H4>
							<Spacing lg />
							<StyledSubRadioGroup>
								<RadioChoices
									// eslint-disable-next-line jsx-a11y/no-autofocus
									autoFocus={autoFocus}
									defaultValue={defaultValue}
									choices={node}
									rootDottedName={rootDottedName}
									type={type}
								/>
							</StyledSubRadioGroup>
						</div>
					) : (
						<div>
							<Radio
								// eslint-disable-next-line jsx-a11y/no-autofocus
								autoFocus={
									// Doit autoFocus si correspond à la valeur par défaut
									(defaultValue &&
										defaultValue ===
											`'${relativeDottedName(
												rootDottedName,
												node.dottedName
											)}'` &&
										autoFocus) ||
									// Sinon doit autoFocus automatiquement
									autoFocus
								}
								value={`'${relativeDottedName(
									rootDottedName,
									node.dottedName
								)}'`}
								id={`radio-input-${relativeDottedName(
									rootDottedName,
									node.dottedName
								).replace(/\s|\./g, '_')}-${rootDottedName.replace(
									/\s|\./g,
									'_'
								)}`}
							>
								{node.title}{' '}
								{node.rawNode.icônes && <Emoji emoji={node.rawNode.icônes} />}{' '}
							</Radio>

							{type !== 'toggle' && (
								<ExplicableRule
									light
									dottedName={node.dottedName as DottedName}
									aria-label={t("Plus d'informations sur {{ title }}", {
										title: node.title,
									})}
								/>
							)}
						</div>
					)}
				</Fragment>
			))}
			{choices.canGiveUp && (
				<>
					<Radio value={'non'}>{t('Aucun')}</Radio>
				</>
			)}
		</>
	)
}

const StyledSubRadioGroup = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding-left: ${({ theme }) => theme.spacings.md};

	> * {
		flex-shrink: 0;
		margin-right: ${({ theme }) => theme.spacings.md};
	}
	border-left: 2px dotted ${({ theme }) => theme.colors.extended.grey[500]};
	padding-left: ${({ theme }) => theme.spacings.md};
	margin-top: calc(${({ theme }) => theme.spacings.md} * -1);
`

export function OuiNonInput(props: InputProps) {
	const { t } = useTranslation()

	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)

	return (
		<ToggleGroup
			aria-label={t('conversation.yes-no.aria-label', 'Oui ou non')}
			{...props}
			onChange={handleChange}
			value={currentSelection ?? undefined}
		>
			{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
			<Radio
				value="oui"
				id={`input-oui-${props.id || ''}`}
				autoFocus={props.autoFocus && defaultValue === 'oui'}
			>
				<Trans>Oui</Trans>
			</Radio>
			{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
			<Radio
				value="non"
				id={`input-non-${props.id || ''}`}
				autoFocus={props.autoFocus && defaultValue === 'non'}
			>
				<Trans>Non</Trans>
			</Radio>
		</ToggleGroup>
	)
}

export function useSelection({ value, onChange, missing }: InputProps) {
	const serializeValue = (nodeValue: Evaluation) =>
		serializeEvaluation({ nodeValue } as EvaluatedNode)

	const defaultValue = serializeValue(value)
	const [currentSelection, setCurrentSelection] = useState<string | null>(
		(!missing && defaultValue) || null
	)

	const debounce = useRef<NodeJS.Timeout>()
	const handleChange = useCallback(
		(val: Key) => {
			val = val.toString()
			if (!val.length) {
				return
			}
			setCurrentSelection(val)

			debounce.current != null && clearTimeout(debounce.current)
			debounce.current = setTimeout(() => {
				onChange(val)
			}, 300)
		},
		[onChange]
	)

	const lastValue = useRef(value)
	useEffect(() => {
		if (lastValue.current !== value) {
			const newSelection = serializeValue(value)
			if (currentSelection !== newSelection) {
				setCurrentSelection(
					!missing && newSelection != null && typeof newSelection === 'string'
						? newSelection
						: null
				)
			}
			lastValue.current = value
		}
	}, [value, missing, currentSelection])

	return { currentSelection, handleChange, defaultValue }
}

export const SwitchInput = (props: {
	onChange?: (isSelected: boolean) => void
	defaultSelected?: boolean
	label?: string
	id?: string
	key?: string
	invertLabel?: boolean
}) => {
	const { onChange, id, label, defaultSelected, key, invertLabel } = props

	return (
		<Switch
			defaultSelected={defaultSelected}
			onChange={(isSelected: boolean) => onChange && onChange(isSelected)}
			light
			id={id}
			key={key}
			invertLabel={invertLabel}
			aria-label={label}
		>
			{label}
		</Switch>
	)
}
