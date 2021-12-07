import { useButton } from '@react-aria/button'
import { useFocusRing } from '@react-aria/focus'
import { HiddenSelect, useSelect } from '@react-aria/select'
import { mergeProps } from '@react-aria/utils'
import { useSelectState } from '@react-stately/select'
import type { AriaSelectProps } from '@react-types/select'
import { CarretDown } from 'DesignSystem/icons/carret-down'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ListBox } from './ListBox'
import { Popover } from './PopOver'

export { Item } from '@react-stately/collections'

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
	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
			}
		`}
`

const Button = styled.button<{
	isFocusVisible?: boolean
}>`
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
	font-family: ${({ theme }) => theme.fonts.main};
	height: 100%;
	outline: none;
	transition: color 0.2s;

	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]} !important;
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

const StyledIcon = styled(CarretDown)<{ isOpen: boolean }>`
	margin: 0 4px;
`
export const Wrapper = styled.div<{
	hasError: boolean
	hasLabel: boolean
	small?: boolean
	isOpen?: boolean
}>`
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
	background-color: ${({ theme, isOpen }) =>
		theme.darkMode
			? isOpen
				? 'rgba(255, 255, 255, 40%)'
				: 'rgba(255, 255, 255,20%)'
			: isOpen
			? theme.colors.extended.grey[200]
			: theme.colors.extended.grey[100]};
	align-items: center;
	transition: all 0.2s;

	:focus-within {
		outline-color: ${({ theme, hasError }) =>
			hasError
				? theme.colors.extended.error[400]
				: theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[700]};
	}
	:focus-within ${Button} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	:focus-within + ${Button} {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	${({ hasLabel }) =>
		hasLabel &&
		css`
			${Button}:not(:focus):placeholder-shown {
				color: transparent;
			}
			${Button}:not(:focus):placeholder-shown + ${Button} {
				color: transparent;
			}
		`}

	${Button}:not(:focus):placeholder-shown + ${Button} {
		font-size: 1rem;
		line-height: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	${({ theme, hasError }) =>
		hasError &&
		css`
			&& {
				border-color: ${theme.colors.extended.error[400]};
			}
			&&& label {
				color: ${theme.colors.extended.error[400]};
			}
		`}

	${Button}, ${Button} {
		padding: ${({ hasLabel, theme, small }) =>
			small
				? css`
						${theme.spacings.xxs} ${theme.spacings.xs}
				  `
				: css`calc(${hasLabel ? '1rem' : '0rem'} + ${theme.spacings.xs}) ${
						theme.spacings.sm
				  } ${theme.spacings.xs}`};
	}

	${({ small }) =>
		small &&
		css`
			${Button}, ${Button} {
				font-size: 1rem;
				line-height: 1.25rem;
			}
		`}
`

export function Select<T extends Record<string, unknown>>(
	props: AriaSelectProps<T> & { small?: boolean; value?: number }
) {
	const { t } = useTranslation()

	// Create state based on the incoming props
	const state = useSelectState(props)

	React.useEffect(() => {
		if (props.value && props.value !== state.selectedKey) {
			state.setSelectedKey(props.value)
		}
		// On ne veut pas d'update bidirectionnel, c'est pourquoi state n'est pas dans
		// les dépendances
	}, [props.value])

	// Get props for child elements from useSelect
	const ref = React.useRef(null)
	const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
		props,
		state,
		ref
	)

	// Get props for the button based on the trigger props from useSelect
	const { buttonProps } = useButton(triggerProps, ref)

	const { focusProps, isFocusVisible } = useFocusRing()
	return (
		<Wrapper isOpen={state.isOpen} hasError={false} hasLabel={false}>
			<HiddenSelect
				state={state}
				triggerRef={ref}
				label={props.label}
				name={props.name}
			/>
			<Button
				{...mergeProps(buttonProps, focusProps)}
				ref={ref}
				isFocusVisible={isFocusVisible}
			>
				{props.label && (
					<Label className={props.small ? 'sr-only' : ''} {...labelProps}>
						{props.label}
					</Label>
				)}
				<Value {...valueProps}>
					{state.selectedItem != null
						? state.selectedItem.rendered
						: t('select.value.default', 'Choisissez une option')}
				</Value>
				<StyledIcon isOpen={state.isOpen} />
			</Button>
			{state.isOpen && (
				<Popover isOpen={state.isOpen} onClose={() => state.close()}>
					<ListBox {...menuProps} state={state} />
				</Popover>
			)}
		</Wrapper>
	)
}
