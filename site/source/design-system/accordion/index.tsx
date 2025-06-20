import { useAccordion, useAccordionItem } from '@react-aria/accordion'
import { TreeState, useTreeState } from '@react-stately/tree'
import { AriaAccordionProps } from '@react-types/accordion'
import { Node } from '@react-types/shared'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Trans } from 'react-i18next'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import { css, styled } from 'styled-components'

import { omit } from '@/utils'

import { Button } from '../buttons'
import { FocusStyle } from '../global-style'
import { ChevronIcon } from '../icons'
import { Grid } from '../layout'
import chevronImg from './chevron.svg'

const SAVE_STATE_LOCALSTORAGE_KEY = 'accordion-state'

export const Accordion = <T extends object>(
	props: AriaAccordionProps<T> & {
		$variant?: 'light'
		shouldToggleAll?: boolean
		title?: ReactNode
		isFoldable?: boolean
		shouldSaveState?: boolean
	}
) => {
	const { title, isFoldable, shouldSaveState } = props
	const state = useTreeState<T>(props)
	const ref = useRef<HTMLDivElement>(null)
	const { accordionProps } = useAccordion(props, state, ref)
	const [shouldOpenAll, setShouldOpenAll] = useState(false)
	const [shouldCloseAll, setShouldCloseAll] = useState(false)

	const openAll = () => {
		setShouldOpenAll(true)
		setTimeout(() => {
			setShouldOpenAll(false)
		}, 100)
	}

	const closeAll = () => {
		setShouldCloseAll(true)
		setTimeout(() => {
			setShouldCloseAll(false)
		})
	}

	// State and useEffect ne fonctionnent pas ensemble
	if (shouldOpenAll) {
		const keys = state.collection.getKeys()
		for (const key of keys) {
			if (!state.expandedKeys.has(key)) {
				state.expandedKeys.add(key)
			}
		}
	}

	if (shouldCloseAll) {
		const keys = state.collection.getKeys()
		for (const key of keys) {
			if (state.expandedKeys.has(key)) {
				state.expandedKeys.delete(key)
			}
		}
	}

	const allItemsOpen = Array.from(state.collection.getKeys()).every((key) =>
		state.expandedKeys.has(key)
	)

	// Save opening state of Accordion between pages
	if (shouldSaveState && localStorage?.getItem(SAVE_STATE_LOCALSTORAGE_KEY)) {
		const arrayExpandedKeys = JSON.parse(
			localStorage.getItem(SAVE_STATE_LOCALSTORAGE_KEY) || ''
		) as string[]

		const keys = state.collection.getKeys()
		for (const key of keys) {
			if (arrayExpandedKeys.includes(key as string)) {
				state.expandedKeys.add(key)
			}
		}
		localStorage.removeItem(SAVE_STATE_LOCALSTORAGE_KEY)
	}

	useEffect(() => {
		if (!shouldSaveState) return

		return () => {
			localStorage.setItem(
				SAVE_STATE_LOCALSTORAGE_KEY,
				JSON.stringify(Array.from(state.expandedKeys))
			)
		}
	}, [state])

	return (
		<>
			{title && (
				<StyledGrid container>
					<Grid item>{title}</Grid>
					{isFoldable && (
						<Grid item>
							<StyledFoldButton
								underline
								onPress={() => (allItemsOpen ? closeAll() : openAll())}
							>
								<StyledChevronIcon $isOpen={allItemsOpen} />
								{allItemsOpen ? (
									<Trans>Tout plier</Trans>
								) : (
									<Trans>Tout déplier</Trans>
								)}
							</StyledFoldButton>
						</Grid>
					)}
				</StyledGrid>
			)}
			<StyledAccordionGroup
				{...omit(props, 'title', 'defaultExpandedKeys')}
				{...accordionProps}
				ref={ref}
			>
				{[...state.collection].map((item) => {
					return (
						<AccordionItem<T>
							key={item.key}
							item={item}
							state={state}
							$variant={props?.$variant}
						/>
					)
				})}
			</StyledAccordionGroup>
		</>
	)
}

const StyledAccordionGroup = styled.div<{ $variant?: 'light' }>`
	max-width: 100%;
	${({ theme }) => css`
		border-radius: ${theme.box.borderRadius};
		border: 1px solid ${theme.colors.bases.primary[400]};
		margin-bottom: ${theme.spacings.lg};
	`}
	${({ $variant }) =>
		$variant === 'light' &&
		css`
			border-radius: 0;
			border: none;
		`}
`

interface AccordionItemProps<T> {
	item: Node<T>
	state: TreeState<T>
	$variant?: 'light'
}

function AccordionItem<T>(props: AccordionItemProps<T>) {
	const ref = useRef<HTMLButtonElement>(null)
	const { state, item, $variant } = props
	const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref)

	const isOpen = state.expandedKeys.has(item.key)

	const [regionRef, { height }] = useMeasure()
	const animatedStyle = useSpring({
		reset: false,
		to: isOpen
			? { opacity: 1, height: height + 48 } // We add 48px that corresponds to the margin
			: { opacity: 0, height: 0 },
	})

	return (
		<StyledAccordionItem onMouseDown={(x) => x.stopPropagation()}>
			<StyledTitle>
				<StyledButton {...buttonProps} ref={ref} $variant={$variant}>
					<span>{item.props.title}</span>
					<ChevronRightMedium $isOpen={isOpen} alt="" />
				</StyledButton>
			</StyledTitle>
			{/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
			<StyledContent
				// @ts-ignore
				{...regionProps}
				style={animatedStyle}
				hidden={!isOpen}
				$variant={$variant}
			>
				<div ref={regionRef}>{item.props.children}</div>
			</StyledContent>
		</StyledAccordionItem>
	)
}

const StyledTitle = styled.h3`
	margin: 0;
`

const StyledAccordionItem = styled.div`
	&:not(:first-child) {
		border-top: 1px solid ${({ theme }) => theme.colors.bases.primary[400]};
	}
`

const StyledButton = styled.button<{ $variant?: 'light' }>`
	display: flex;
	width: 100%;
	background: none;
	border: none;
	justify-content: space-between;
	${({ theme }) => css`
		font-family: ${theme.fonts.main};
		font-size: ${theme.baseFontSize};
		color: ${theme.colors.bases.primary[700]};
		padding: ${theme.spacings.lg};
		background-color: ${theme.colors.bases.primary[100]};
		> span {
			border-radius: ${theme.box.borderRadius};
		}
	`}
	&:hover {
		text-decoration: ${({ $variant }) =>
			$variant === 'light' ? 'none' : 'underline'};
	}
	&:focus {
		${FocusStyle}
	}

	${({ $variant }) =>
		$variant === 'light' &&
		css`
			background-color: transparent;
			padding: 1.5rem;
			padding-left: 0;
			align-items: center;
			> span {
				border-radius: 0;
			}
		`}
`

interface Chevron {
	$isOpen: boolean
}

const ChevronRightMedium = styled.img.attrs({ src: chevronImg })<Chevron>`
	transition: transform 0.3s;
	${({ $isOpen }) =>
		!$isOpen &&
		css`
			transform: rotate(180deg);
		`}
`

const StyledContent = styled(animated.div)<{
	$isOpen: boolean
	$variant?: 'light'
}>`
	overflow: hidden;
	> div {
		margin: ${({ theme, $variant }) =>
			$variant !== 'light' && theme.spacings.lg};
	}
`

const StyledGrid = styled(Grid)`
	justify-content: space-between;
	align-items: center;
`

const StyledFoldButton = styled(Button)`
	text-decoration: none;
	background-color: transparent;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	&:hover {
		text-decoration: none;
	}
`

const StyledChevronIcon = styled(ChevronIcon)<{ $isOpen?: boolean }>`
	transition: transform 0.15s ease-in-out;
	transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-90deg)' : 'rotate(90deg)')};
	fill: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]}!important;
`

Accordion.StyledTitle = StyledTitle
