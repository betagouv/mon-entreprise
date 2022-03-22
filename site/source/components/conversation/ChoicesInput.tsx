import { useDebounce } from '@/components/utils'
import Emoji from '@/components/utils/Emoji'
import { Markdown } from '@/components/utils/markdown'
import ButtonHelp from '@/design-system/buttons/ButtonHelp'
import { Radio, RadioGroup, ToggleGroup } from '@/design-system/field'
import { RadioBlock } from '@/design-system/field/Radio/Radio'
import { Item, Select } from '@/design-system/field/Select'
import { Spacing } from '@/design-system/layout'
import { H4 } from '@/design-system/typography/heading'
import { DottedName } from 'modele-social'
import { EvaluatedNode, RuleNode, serializeEvaluation } from 'publicodes'
import {
	createContext,
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
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

	const Component = type === 'radio' ? RadioGroup : ToggleGroup

	return (
		<Component onChange={handleChange} value={currentSelection ?? undefined}>
			{type === 'radio' || type === 'toggle' ? (
				<RadioChoice
					autoFocus={defaultValue}
					choice={choice}
					rootDottedName={props.dottedName}
				/>
			) : (
				choice.children.map((node) => (
					<Fragment key={node.dottedName}>
						<RadioBlock
							autoFocus={
								defaultValue ===
								`'${relativeDottedName(props.dottedName, node.dottedName)}'`
							}
							value={`'${relativeDottedName(
								props.dottedName,
								node.dottedName
							)}'`}
							title={node.title}
							emoji={node.rawNode.icônes}
							description={node.rawNode.description}
						/>
					</Fragment>
				))
			)}
		</Component>
	)
}

function RadioChoice<Names extends string = DottedName>({
	choice,
	autoFocus,
	rootDottedName,
}: {
	choice: Choice
	autoFocus?: string
	rootDottedName: Names
}) {
	const hiddenOptions = useContext(HiddenOptionContext)

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
								<RadioChoice choice={node} rootDottedName={rootDottedName} />
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
							{node.rawNode.description && (
								<ButtonHelp type="info" light title={node.title}>
									<Markdown>{node.rawNode.description ?? ''}</Markdown>
								</ButtonHelp>
							)}
						</span>
					)}
				</Fragment>
			))}
			{choice.canGiveUp && (
				<>
					<Radio value={'non'}>
						<Trans>Aucun</Trans>
					</Radio>
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
		<ToggleGroup onChange={handleChange} value={currentSelection ?? undefined}>
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
	const defaultValue = serializeEvaluation({
		nodeValue: value,
	} as EvaluatedNode)
	const [currentSelection, setCurrentSelection] = useState(
		missing ? null : defaultValue
	)
	const handleChange = useCallback(
		(value) => {
			value && setCurrentSelection(value)
		},
		[setCurrentSelection]
	)
	const debouncedSelection = useDebounce(currentSelection, 300)
	useEffect(() => {
		if (
			debouncedSelection &&
			(missing ||
				serializeEvaluation({ nodeValue: value } as EvaluatedNode) !==
					debouncedSelection)
		) {
			onChange(debouncedSelection)
		}
	}, [debouncedSelection])

	return { currentSelection, handleChange, defaultValue }
}
