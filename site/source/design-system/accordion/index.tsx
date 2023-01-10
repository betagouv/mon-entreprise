import { useAccordion, useAccordionItem } from '@react-aria/accordion'
import { TreeState, useTreeState } from '@react-stately/tree'
import { AriaAccordionProps } from '@react-types/accordion'
import { Node } from '@react-types/shared'
import { useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import styled, { css } from 'styled-components'

import { FocusStyle } from '../global-style'
import chevronImg from './chevron.svg'

export const Accordion = <T extends object>(
	props: AriaAccordionProps<T> & {
		variant?: 'light'
		shouldOpenAll?: boolean
	}
) => {
	const state = useTreeState<T>(props)
	const ref = useRef<HTMLDivElement>(null)
	const { accordionProps } = useAccordion(props, state, ref)

	return (
		<StyledAccordionGroup {...props} {...accordionProps} ref={ref}>
			{[...state.collection].map((item) => {
				return (
					<AccordionItem<T>
						key={item.key}
						item={item}
						state={state}
						$variant={props?.variant}
						isOpen={props?.shouldOpenAll}
					/>
				)
			})}
		</StyledAccordionGroup>
	)
}

const StyledAccordionGroup = styled.div<{ variant?: 'light' }>`
	overflow: hidden;
	max-width: 100%;
	${({ theme }) =>
		css`
			border-radius: ${theme.box.borderRadius};
			border: 1px solid ${theme.colors.bases.primary[400]};
			margin-bottom: ${theme.spacings.lg};
		`}
	${({ variant }) =>
		variant === 'light' &&
		css`
			border-radius: 0;
			border: none;
		`}
`

interface AccordionItemProps<T> {
	item: Node<T>
	state: TreeState<T>
	$variant?: 'light'
	isOpen?: boolean
}

function AccordionItem<T>(props: AccordionItemProps<T>) {
	const ref = useRef<HTMLButtonElement>(null)
	const { state, item, $variant } = props
	const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref)

	const isOpen = props?.isOpen ?? state.expandedKeys.has(item.key)

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
					<ChevronRightMedium aria-hidden $isOpen={isOpen} alt="" />
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
	:not(:first-child) {
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
	:hover {
		text-decoration: ${({ $variant }) =>
			$variant === 'light' ? 'none' : 'underline'};
	}
	:focus {
		${FocusStyle}
	}

	${({ theme, $variant }) =>
		$variant === 'light' &&
		css`
			background-color: transparent;
			padding: 1.5rem;
			padding-left: 0;
			align-items: center;
			border-bottom: 1px solid ${theme.colors.bases.primary[400]};
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

Accordion.StyledTitle = StyledTitle
