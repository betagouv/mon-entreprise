import { useRadio } from '@react-aria/radio'
import { RadioGroupState } from '@react-stately/radio'
import { AriaRadioProps } from '@react-types/radio'
import React, { createContext, useContext, useRef } from 'react'
import { css, styled } from 'styled-components'

import { FocusStyle } from '@/design-system/global-style'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

export const RadioContext = createContext<RadioGroupState | null>(null)

type RadioProps = AriaRadioProps & {
	className?: string
	role?: string
	visibleRadioAs?: string | React.ComponentType
	precision?: React.ReactNode
}

// TDOO: isDisabled style
export function Radio(props: RadioProps) {
	const { children } = props

	return (
		<RadioSkeleton role="radio" aria-atomic {...props}>
			<RadioPoint />
			<SpanBody>{children}</SpanBody>
		</RadioSkeleton>
	)
}

export const RadioSkeleton = (props: RadioProps) => {
	const { visibleRadioAs, id, precision, ...ariaProps } = props
	const { children } = ariaProps
	const state = useContext(RadioContext)
	if (!state) {
		throw new Error("Radio can't be instanciated outside a RadioContext")
	}

	const ref = useRef(null)
	const { inputProps } = useRadio(ariaProps, state, ref)

	return (
		<>
			<Label htmlFor={id} className={props.className}>
				<InputRadio
					{...inputProps}
					// Avoid react-aria focus next element (input, button, etc.) on keydown for rgaa
					onKeyDown={undefined}
					onKeyUp={undefined}
					tabIndex={undefined}
					className="sr-only"
					ref={ref}
					id={id}
				/>
				<VisibleRadio as={visibleRadioAs} $inert={props.isDisabled}>
					{children}
				</VisibleRadio>
			</Label>
			{precision && <PrecisionSpan>{precision}</PrecisionSpan>}
		</>
	)
}

export const RadioPoint = ({ className }: { className?: string }) => (
	<RadioButton aria-hidden className={className}>
		<OutsideCircle />
		<InsideCircle />
	</RadioButton>
)

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

export const RadioButton = styled.span`
	--size: ${({ theme }) => theme.spacings.md};
	--halo: ${({ theme }) => theme.spacings.sm};
	height: var(--size);
	width: var(--size);
	cursor: pointer;
	flex-shrink: 0;
	position: relative;
	margin-right: var(--halo);
	&::before {
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

export const VisibleRadio = styled.span<{ $inert?: boolean }>`
	display: inline-flex;
	align-items: center;
	text-align: initial;
	padding: 0 ${({ theme }) => theme.spacings.sm};
	margin: 0 calc(-1 * ${({ theme }) => theme.spacings.sm});
	border-radius: ${({ theme }) => theme.box.borderRadius};
	z-index: 1;
	${({ theme, $inert }) =>
		!$inert
			? css`
			&:hover > ${RadioButton}::before {
				opacity: 1;
				transform: scale(1);
			}

			&:hover ${OutsideCircle} {
				border-color: ${
					theme.darkMode
						? theme.colors.bases.primary[500]
						: theme.colors.bases.primary[700]
				};
			} :
		`
			: css`
					&:hover {
						background-color: ${theme.colors.extended.grey[200]} !important;
					}
					&:hover,
					&:hover * {
						cursor: default !important;
					}
			  `}
`

const Label = styled.label<{ htmlFor?: string }>``

const PrecisionSpan = styled(SmallBody).attrs({ as: 'span' })`
	margin: 0;
	margin-left: ${({ theme }) => theme.spacings.md};
	background-color: transparent;
`

export const SpanBody = styled(Body).attrs({ as: 'span' })`
	margin: ${({ theme }) => theme.spacings.xs} 0px;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	background-color: transparent;
	display: inline-flex;
	align-items: center;
`

export const InputRadio = styled.input`
	&:focus
		+ ${VisibleRadio}
		${OutsideCircle},
		&:checked
		+ ${VisibleRadio}
		${OutsideCircle} {
		border-color: ${({ theme }) => theme.colors.bases.primary[700]};
	}

	&:focus + ${VisibleRadio} {
		${FocusStyle}
	}

	&:checked + ${VisibleRadio} ${InsideCircle} {
		transform: scale(1);
	}
`
