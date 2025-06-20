import { AriaListBoxOptions, useListBox, useOption } from '@react-aria/listbox'
import type { ListState } from '@react-stately/list'
import type { Node } from '@react-types/shared'
import {
	createContext,
	HTMLAttributes,
	ReactNode,
	RefObject,
	useContext,
	useRef,
} from 'react'
import { css, styled } from 'styled-components'

interface ListBoxProps extends AriaListBoxOptions<unknown> {
	listBoxRef?: RefObject<HTMLUListElement>
	state: ListState<unknown>
}

interface OptionProps {
	item: Node<unknown>
	state: ListState<unknown>
}

const List = styled.ul`
	max-height: 300px;
	width: 100%;
	overflow: auto;
	list-style: none;
	padding: 0;
	margin: 0;
	outline: none;
`

const FocusedOption = css`
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[600]
			: theme.colors.bases.primary[100]} !important;
	border-color: ${({ theme }) => theme.colors.bases.primary[500]} !important;
`

const ListItem = styled.li<{ $isFocused?: boolean; $isSelected?: boolean }>`
	font-weight: ${({$isSelected}) => ($isSelected ? '600' : 'normal')};
	cursor: default;
	outline: none;
	font-family: ${({ theme }) => theme.fonts.main};

	text-align: left;
	display: block;
	color: ${({ theme, $isSelected }) =>
		theme.darkMode
			? $isSelected
				? theme.colors.bases.primary[200]
				: theme.colors.extended.dark[100]
			: $isSelected
			? theme.colors.bases.primary[600]
			: theme.colors.extended.grey[700]};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[500]
			: theme.colors.extended.grey[100]} !important;
	width: 100%;

	border-radius: 0.3rem;
	border: 2px solid transparent;
	&:hover,
	&:focus {
		${FocusedOption}
	}
	max-width: 100%;
	margin-bottom: 0.3rem;
	font-size: 100%;
	padding: 0.6rem;
	${({$isFocused}) => $isFocused && FocusedOption}
`

const ItemContent = styled.div`
	display: flex;
	align-items: center;
`

export function ListBox(props: ListBoxProps) {
	const ref = useRef<HTMLUListElement>(null)
	const { listBoxRef = ref, state } = props
	const { listBoxProps } = useListBox(props, state, listBoxRef)

	return (
		<List {...listBoxProps} ref={listBoxRef}>
			{[...state.collection].map((item) => (
				<Option key={item.key} item={item} state={state} />
			))}
		</List>
	)
}

interface OptionContextValue {
	labelProps: HTMLAttributes<HTMLElement>
	descriptionProps: HTMLAttributes<HTMLElement>
}

const OptionContext = createContext<OptionContextValue>({
	labelProps: {},
	descriptionProps: {},
})

function Option({ item, state }: OptionProps) {
	const ref = useRef<HTMLLIElement>(null)
	const { optionProps, labelProps, descriptionProps, isSelected, isFocused } =
		useOption(
			{
				key: item.key,
			},
			state,
			ref
		)

	return (
		<ListItem
			{...optionProps}
			ref={ref}
			$isFocused={isFocused}
			$isSelected={isSelected}
		>
			<ItemContent>
				<OptionContext.Provider value={{ labelProps, descriptionProps }}>
					{item.rendered}
				</OptionContext.Provider>
			</ItemContent>
		</ListItem>
	)
}

// The Label and Description components will be used within an <Item>.
// They receive props from the OptionContext defined above.
// This ensures that the option is ARIA labelled by the label, and
// described by the description, which makes for better announcements
// for screen reader users.

export function Label({ children }: { children: ReactNode }) {
	const { labelProps } = useContext(OptionContext)

	return <div {...labelProps}>{children}</div>
}

const StyledDescription = styled.div`
	font-weight: normal;
	font-size: 12px;
`

export function Description({ children }: { children: ReactNode }) {
	const { descriptionProps } = useContext(OptionContext)

	return <StyledDescription {...descriptionProps}>{children}</StyledDescription>
}
