import React from 'react'
import styled from 'styled-components'

const HiddenCheckbox = styled.input`
	display: none;
`

const Label = styled.label`
	display: inline-flex;
`

const CheckboxVisualContainer = styled.div`
	cursor: pointer;
	display: inline-flex;
	position: relative;
	margin: 0;
	width: 1em;
	line-height: 1em;
	height: 1em;
	-webkit-tap-highlight-color: transparent;
	transform: translate3d(0, 0, 0);
	outline: none !important;

	&:before {
		content: '';
		position: absolute;
		top: -0.6em;
		left: -0.6em;
		width: 2.2em;
		height: 2.2em;
		border-radius: 50%;
		background: rgba(34, 50, 84, 0.03);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	&:hover:before,
	&:focus:before {
		opacity: 1;
	}
`

const CheckboxVisual = styled.svg`
	position: relative;
	z-index: 1;
	fill: none;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke: #c8ccd4;
	stroke: var(--color);
	stroke-width: 1.5px;
	transform: translate3d(0, 0, 0);
	transition: all 0.2s ease;

	${HiddenCheckbox}:checked + ${Label} & {
		stroke: var(--color);

		& > path {
			stroke-dashoffset: 60;
			transition: all 0.15s linear;
		}

		& > polyline {
			stroke-dashoffset: 42;
			transition: all 0.1s linear;
			transition-delay: 0.075s;
		}
	}

	& path {
		stroke-dasharray: 60;
		stroke-dashoffset: 0;
	}
	& polyline {
		stroke-dasharray: 22;
		stroke-dashoffset: 66;
	}
`

export default function Checkbox(
	props: React.ComponentPropsWithoutRef<'input'> & { label?: string }
) {
	return (
		<>
			<HiddenCheckbox type="checkbox" {...props} />
			<Label htmlFor={props.id} tabIndex={0}>
				<CheckboxVisualContainer className="ui__ checkbox">
					<CheckboxVisual width="1em" height="1em" viewBox="0 0 18 18">
						<path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
						<polyline points="1 9 7 14 15 4" />
					</CheckboxVisual>
				</CheckboxVisualContainer>
				{'label' in props && (
					<span style={{ marginLeft: '0.6rem' }}>{props.label}</span>
				)}
			</Label>
		</>
	)
}
