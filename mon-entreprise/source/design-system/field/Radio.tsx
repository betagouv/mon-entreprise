import { RadioAriaProps, useRadio, useRadioGroup } from '@react-aria/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import { RadioGroupState, useRadioGroupState } from '@react-stately/radio'
import { Body } from 'DesignSystem/typography/paragraphs'
import { createContext, useContext, useRef } from 'react'
import styled, { css } from 'styled-components'
import { ReactNode } from 'react'
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
			<VisibleRadio aria-hidden="true">
				<RadioButton>
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
	border: 2px solid ${({ theme }) => theme.colors.extended.grey[500]};
	transition: all 0.2s;
	border-radius: 50%;
	height: 100%;
	width: 100%;
`

const InsideCircle = styled.span`
	--padding: 4px;
	position: absolute;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
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
		transition: opacity 0.2s ease;
	}
`

const VisibleRadio = styled.div`
	display: inline-flex;
	align-items: baseline;
	z-index: 1;
	transition: all 0.2s;

	:hover > ${RadioButton}::before {
		opacity: 1;
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

	:checked + ${VisibleRadio} ${InsideCircle} {
		transform: scale(1);
	}
`

export function ToggleGroup(
	props: AriaRadioGroupProps & {
		label?: string
		hideRadio?: boolean
		children: ReactNode
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
	--radius: 4px;
	display: inline-flex;
	${VisibleRadio} {
		position: relative;
		align-items: center;
		z-index: 1;
		border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};
		margin-right: -1px;
		cursor: pointer;
		padding: ${({ theme: { spacings } }) => spacings.xs + ' ' + spacings.lg};
	}
	${VisibleRadio}:focus-within {
		outline: 1px dashed ${({ theme }) => theme.colors.extended.grey[700]};
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
