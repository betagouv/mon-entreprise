import { useButton } from '@react-aria/button'
import { useFocusRing } from '@react-aria/focus'
import { useSelect } from '@react-aria/select'
import { mergeProps } from '@react-aria/utils'
import { useSelectState } from '@react-stately/select'
import type { AriaSelectProps } from '@react-types/select'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { omit } from '@/utils'

import { FocusStyle } from '../../../global-style'
import { CarretDownIcon } from '../../../icons'
import { ListBox } from './ListBox'
import { Popover } from './PopOver'

export const Label = styled.label`
	display: block;
	text-align: left;
	top: 0%;
	left: 0;
	pointer-events: none;
	transform: translateY(0%);
	font-size: 0.75rem;
	line-height: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.sm}`};
	position: absolute;
	will-change: transform top font-size line-height color;
	transition: all 0.1s;
	transition:
		color 0s,
		background-color 0s;
	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
				background-color: transparent;
			}
		`}
`

const Button = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	text-align: left;
	appearance: none;
	font-size: 1rem;
	line-height: 1.5rem;
	border: none;
	width: 100%;
	background: none;
	color: inherit;
	font-family: ${({ theme }) => theme.fonts.main};
	height: 100%;
	outline: none;
	transition: color 0.2s;

	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
				background-color: transparent;
			}
		`}
`

const Value = styled.span`
	display: inline-flex;
	align-items: center;
	font-size: 1rem;
	line-height: 1.5rem;
	margin-top: 1rem;
`

const StyledIcon = styled(CarretDownIcon)`
	margin: 0 4px;
`

interface WrapperProps {
	$isOpen: boolean
}

const Wrapper = styled.div<WrapperProps>`
	overflow: hidden;
	display: flex;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) =>
		`${theme.box.borderWidth} solid ${
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[700]
		}`};
	outline: transparent solid 1px;
	position: relative;
	background-color: ${({ theme, $isOpen }) =>
		theme.darkMode
			? $isOpen
				? theme.colors.extended.dark[700]
				: theme.colors.extended.dark[600]
			: $isOpen
			? theme.colors.extended.grey[200]
			: theme.colors.extended.grey[100]};
	align-items: center;
	transition: all 0.2s;

	&:focus-within {
		${FocusStyle}
	}

	${Button}:not(:focus):placeholder-shown + ${Button} {
		font-size: 1rem;
		line-height: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	${Button}, ${Button} {
		padding: ${({ theme }) =>
			`${theme.spacings.xs} ${theme.spacings.sm} ${theme.spacings.xs}`};
	}
`

export function Select<T extends Record<string, unknown>>(
	props: AriaSelectProps<T> & { small?: boolean; value?: number }
) {
	const { t } = useTranslation()

	// Create state based on the incoming props
	const state = useSelectState(props)

	useEffect(() => {
		if (props.value && props.value !== state.selectedKey) {
			state.setSelectedKey(props.value)
		}
		// On ne veut pas d'update bidirectionnel, c'est pourquoi state n'est pas dans
		// les dépendances
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value])

	// Get props for child elements from useSelect
	const ref = useRef<HTMLButtonElement>(null)
	const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
		props,
		state,
		ref
	)

	// Get props for the button based on the trigger props from useSelect
	const { buttonProps } = useButton(triggerProps, ref)

	const { focusProps } = useFocusRing()

	const wrapperRef = useRef<HTMLDivElement>(null)

	// Fix : W3C Validator marque l'ajout d'une balise option vide comme étant une erreur
	useEffect(() => {
		const hiddenSelect = wrapperRef?.current?.querySelector('select')

		hiddenSelect?.childNodes.forEach((childNode) => {
			if (childNode.textContent === '') {
				hiddenSelect?.removeChild(childNode)
			}
		})
	}, [])

	// Fix : Asqatasun détecte 2 violations au niveau du hidden select
	// pas moyen d'accéder aux props de manière plus propre rapidement
	useEffect(() => {
		const selectInput = wrapperRef?.current?.querySelector('input')

		if (selectInput) {
			selectInput.setAttribute('id', buttonProps.id || '')
			selectInput.setAttribute('aria-label', 'Hidden select input')
		}
	}, [])

	return (
		<Container>
			<Wrapper ref={wrapperRef} $isOpen={state.isOpen}>
				{/*
				// React aria throws an arror if we let this here
					<HiddenSelect
					state={state}
					triggerRef={ref}
					label={props.label}

					name={props.name}
				/> */}
				{props.label && (
					<Label className={props.small ? 'sr-only' : ''} {...labelProps}>
						{props.label}
					</Label>
				)}
				<Button {...mergeProps(omit(buttonProps, 'id'), focusProps)} ref={ref}>
					<Value {...valueProps}>
						{state.selectedItem != null
							? state.selectedItem.rendered
							: t('select.value.default', 'Choisissez une option')}
					</Value>
					<StyledIcon />
				</Button>
			</Wrapper>

			{state.isOpen && (
				<Popover isOpen={state.isOpen} onClose={() => state.close()}>
					<ListBox {...menuProps} state={state} />
				</Popover>
			)}
		</Container>
	)
}

const Container = styled.div`
	position: relative;
`
