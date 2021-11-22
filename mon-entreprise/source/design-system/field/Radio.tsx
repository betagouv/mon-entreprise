import { RadioAriaProps, useRadio, useRadioGroup } from '@react-aria/radio'
import { RadioGroupState, useRadioGroupState } from '@react-stately/radio'
import { RadioGroupProps } from '@react-types/radio'
import { FocusStyle } from 'DesignSystem/global-style'
import { Body } from 'DesignSystem/typography/paragraphs'
import React, { createContext, useContext, useRef } from 'react'
import styled, { css } from 'styled-components'

const RadioContext = createContext<RadioGroupState | null>(null)

export function Radio(props: RadioAriaProps) {
	const { children } = props
	const state = useContext(RadioContext)
	if (!state) {
		throw new Error("Radio can't be instanciated outside a RadioContext")
	}
	const ref = useRef(null)
	const { inputProps } = useRadio(props, state, ref)
	return (
		<label>
			<InputRadio {...inputProps} className="sr-only" ref={ref} />
			<VisibleRadio>
				<RadioButton aria-hidden="true">
					<OutsideCircle />
					<InsideCircle />
				</RadioButton>
				<LabelBody>{children}</LabelBody>
			</VisibleRadio>
		</label>
	)
}

const OutsideCircle = styled.span`
	position: absolute;
	border: 2px solid ${({ theme }) => theme.colors.extended.grey[600]};
	transition: all 0.2s;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};

	height: 100%;
	width: 100%;
`

const InsideCircle = styled.span`
	--padding: 0.25rem;
	position: absolute;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
	color-adjust: exact;
	border-radius: 50%;
	transform: scale(0);
	transition: all 0.2s;
	top: var(--padding);
	left: var(--padding);
	height: calc(100% - 2 * var(--padding));
	width: calc(100% - 2 * var(--padding));
`

const RadioButton = styled.span`
	--size: ${({ theme }) => theme.spacings.md};
	--halo: ${({ theme }) => theme.spacings.sm};
	height: var(--size);
	width: var(--size);
	cursor: pointer;
	flex-shrink: 0;
	position: relative;
	margin-right: var(--halo);
	::before {
		content: '';
		position: absolute;
		top: calc(var(--halo) * -1);
		left: calc(var(--halo) * -1);
		width: calc(var(--halo) * 2 + var(--size));
		height: calc(var(--halo) * 2 + var(--size));
		border-radius: 50%;
		background: ${({ theme }) => theme.colors.bases.primary[100]};
		z-index: 0;
		opacity: 0;
		transition: all 0.15s ease;
		transform: scale(0.5);
	}
`

const VisibleRadio = styled.div`
	display: inline-flex;
	align-items: center;
	padding: 0 ${({ theme }) => theme.spacings.sm};
	margin: 0 calc(-1 * ${({ theme }) => theme.spacings.sm});
	border-radius: ${({ theme }) => theme.box.borderRadius};
	z-index: 1;
	:hover > ${RadioButton}::before {
		opacity: 1;
		transform: scale(1);
	}

	:hover ${OutsideCircle} {
		border-color: ${({ theme }) => theme.colors.bases.primary[700]};
	}
`

const LabelBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xs} 0px;
	margin-left: ${({ theme }) => theme.spacings.xxs};
`
const InputRadio = styled.input`
	:focus
		+ ${VisibleRadio}
		${OutsideCircle},
		:checked
		+ ${VisibleRadio}
		${OutsideCircle} {
		border-color: ${({ theme }) => theme.colors.bases.primary[700]};
	}
	:focus-visible + ${VisibleRadio} {
		${FocusStyle}
		outline-offset: 0;
	}

	:checked + ${VisibleRadio} ${InsideCircle} {
		transform: scale(1);
	}
`

export function ToggleGroup(
	props: RadioGroupProps & {
		label?: string
		hideRadio?: boolean
		children: React.ReactNode
	}
) {
	const { children, label } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(
		{ ...props, orientation: 'horizontal' },
		state
	)

	return (
		<div {...radioGroupProps}>
			{label && <span {...labelProps}>{label}</span>}
			<ToggleGroupContainer hideRadio={props.hideRadio ?? false}>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</ToggleGroupContainer>
		</div>
	)
}

const ToggleGroupContainer = styled.div<{ hideRadio: boolean }>`
	--radius: 0.25rem;
	display: inline-flex;

	${VisibleRadio} {
		position: relative;
		align-items: center;
		z-index: 1;
		border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};
		margin: 0;
		margin-right: -1px;
		border-radius: 0;
		cursor: pointer;
		padding: ${({ theme: { spacings } }) => spacings.xs + ' ' + spacings.lg};
		background: ${({ theme }) => theme.colors.extended.grey[100]};
	}

	${LabelBody} {
		margin: 0;
		margin-left: ${({ theme }) => theme.spacings.xxs};
	}

	> :first-child ${VisibleRadio} {
		border-top-left-radius: var(--radius);
		border-bottom-left-radius: var(--radius);
	}

	> :last-child ${VisibleRadio} {
		border-top-right-radius: var(--radius);
		border-bottom-right-radius: var(--radius);
		margin-right: 0;
	}

	${InputRadio}:checked + ${VisibleRadio} {
		z-index: 2;
		border: 1px solid ${({ theme }) => theme.colors.bases.primary[700]};
		background-color: ${({ theme }) => theme.colors.bases.primary[200]};
	}

	${VisibleRadio}:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}
	${RadioButton} {
		${({ hideRadio }) =>
			hideRadio &&
			css`
				display: none;
			`}
		margin-right: ${({ theme }) => theme.spacings.xxs};
	}
	${RadioButton}::before {
		opacity: 0 !important;
	}
`

export function RadioGroup(
	props: RadioGroupProps & {
		children: React.ReactNode
	}
) {
	const { children, label } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(props, state)

	return (
		<div {...radioGroupProps}>
			{label && <span {...labelProps}>{label}</span>}
			<RadioGroupContainer orientation={props.orientation ?? 'vertical'}>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</RadioGroupContainer>
		</div>
	)
}

const RadioGroupContainer = styled.div<{
	orientation: 'horizontal' | 'vertical'
}>`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${({ orientation }) =>
		orientation === 'horizontal' ? 'row' : 'column'};
`
