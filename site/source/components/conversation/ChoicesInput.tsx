import Emoji from '@/components/utils/Emoji'
import {
	Radio,
	RadioCard,
	RadioCardGroup,
	RadioGroup,
	ToggleGroup,
} from '@/design-system'
import { Item, Select } from '@/design-system/field/Select'
import { Spacing } from '@/design-system/layout'
import { H4 } from '@/design-system/typography/heading'
import { DottedName } from 'modele-social'
import {
	EvaluatedNode,
	Evaluation,
	RuleNode,
	serializeEvaluation,
} from 'publicodes'
import {
	createContext,
	Fragment,
	Key,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
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

export type Choice = RuleNode & {
	children: Array<RuleNode | Choice>
	canGiveUp?: boolean
}

// TODO : This is hacky, the logic to hide/disable some of the possible answer
// to a mutliple-choice question must be handled by Publicodes. We use a React
// context instead of passing down props to avoid polluting to much code with
// this undesirable option.
export const HiddenOptionContext = createContext<Array<DottedName>>([])

export function MultipleAnswerInput<Names extends string = DottedName>({
	choice,
	type = 'radio',
	...props
}: {
	choice: Choice
	type?: 'radio' | 'card' | 'toggle' | 'select'
} & InputProps<Names>) {
	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)

	if (type === 'select') {
		return (
			<Select
				aria-labelledby={props['aria-labelledby'] || undefined}
				label={props.title}
				onSelectionChange={handleChange}
				defaultSelectedKey={defaultValue}
				selectedKey={currentSelection}
			>
				{choice.children.map((node) => (
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
				onChange={handleChange}
				value={currentSelection ?? undefined}
				aria-labelledby={props['aria-labelledby'] || undefined}
			>
				{choice.children.map((node) => (
					<Fragment key={node.dottedName}>
						<RadioCard
							autoFocus={
								defaultValue ===
								`'${relativeDottedName(props.dottedName, node.dottedName)}'`
							}
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
			onChange={handleChange}
			value={currentSelection ?? undefined}
			aria-labelledby={props['aria-labelledby'] || undefined}
		>
			<RadioChoice
				autoFocus={props.autoFocus ? defaultValue : undefined}
				choice={choice}
				rootDottedName={props.dottedName}
				type={type}
			/>
		</Component>
	)
}

function RadioChoice<Names extends string = DottedName>({
	choice,
	autoFocus,
	rootDottedName,
	type,
}: {
	choice: Choice
	autoFocus?: string
	rootDottedName: Names
	type: 'radio' | 'toggle'
}) {
	const hiddenOptions = useContext(HiddenOptionContext)
	const { t } = useTranslation()

	return (
		<>
			{choice.children.map((node) => (
				<Fragment key={node.dottedName}>
					{' '}
					{hiddenOptions.includes(
						node.dottedName as DottedName
					) ? null : 'children' in node ? (
						<div
							role="group"
							aria-describedby={node.dottedName + '-legend'}
							css={`
								margin-top: -1rem;
							`}
						>
							<H4 id={node.dottedName + '-legend'}>{node.title}</H4>
							<Spacing lg />
							<StyledSubRadioGroup>
								<RadioChoice
									choice={node}
									rootDottedName={rootDottedName}
									type={type}
								/>
							</StyledSubRadioGroup>
						</div>
					) : (
						<span>
							<Radio
								autoFocus={
									autoFocus ===
									`'${relativeDottedName(rootDottedName, node.dottedName)}'`
								}
								value={`'${relativeDottedName(
									rootDottedName,
									node.dottedName
								)}'`}
							>
								{node.title}{' '}
								{node.rawNode.icônes && <Emoji emoji={node.rawNode.icônes} />}
							</Radio>{' '}
							{type !== 'toggle' && (
								<ExplicableRule
									light
									dottedName={node.dottedName as DottedName}
								/>
							)}
						</span>
					)}
				</Fragment>
			))}
			{choice.canGiveUp && (
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

export function OuiNonInput<Names extends string = DottedName>(
	props: InputProps<Names>
) {
	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)

	return (
		<ToggleGroup
			onChange={handleChange}
			value={currentSelection ?? undefined}
			aria-labelledby={props['aria-labelledby'] || undefined}
		>
			<Radio value="oui" autoFocus={props.autoFocus && defaultValue === 'oui'}>
				<Trans>Oui</Trans>
			</Radio>
			<Radio value="non" autoFocus={props.autoFocus && defaultValue === 'non'}>
				<Trans>Non</Trans>
			</Radio>
		</ToggleGroup>
	)
}

export function useSelection<Names extends string = DottedName>({
	value,
	onChange,
	missing,
}: InputProps<Names>) {
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
			if (newSelection && newSelection !== currentSelection && !missing) {
				handleChange(newSelection)
			}
			lastValue.current = value
		}
	}, [currentSelection, handleChange, value, missing])

	return { currentSelection, handleChange, defaultValue }
}
