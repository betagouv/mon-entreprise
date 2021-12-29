import { useDebounce } from 'Components/utils'
import Emoji from 'Components/utils/Emoji'
import { Markdown } from 'Components/utils/markdown'
import ButtonHelp from 'DesignSystem/buttons/ButtonHelp'
import { Radio, RadioGroup } from 'DesignSystem/field'
import { Spacing } from 'DesignSystem/layout'
import { H4 } from 'DesignSystem/typography/heading'
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

export function MultipleAnswerInput({
	choice,
	...props
}: { choice: Choice } & InputProps<DottedName>) {
	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)
	return (
		<RadioGroup onChange={handleChange} value={currentSelection ?? undefined}>
			<RadioChoice
				autoFocus={defaultValue}
				choice={choice}
				rootDottedName={props.dottedName}
			/>
		</RadioGroup>
	)
}

function RadioChoice({
	choice,
	autoFocus,
	rootDottedName,
}: {
	choice: Choice
	autoFocus?: string
	rootDottedName: DottedName
}) {
	const relativeDottedName = (radioDottedName: string) =>
		radioDottedName.split(rootDottedName + ' . ')[1]
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
									autoFocus === `'${relativeDottedName(node.dottedName)}'`
								}
								value={`'${relativeDottedName(node.dottedName)}'`}
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

export function OuiNonInput(props: InputProps<DottedName>) {
	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)
	return (
		<RadioGroup onChange={handleChange} value={currentSelection ?? undefined}>
			<Radio value="oui" autoFocus={props.autoFocus && defaultValue === 'oui'}>
				<Trans>Oui</Trans>
			</Radio>
			<Radio value="non" autoFocus={props.autoFocus && defaultValue === 'non'}>
				<Trans>Non</Trans>
			</Radio>
		</RadioGroup>
	)
}

function useSelection({ value, onChange, missing }: InputProps<DottedName>) {
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
