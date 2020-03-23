import React, { useCallback } from 'react'
import styled from 'styled-components'
import { debounce } from '../../utils'

type RangeSliderProps = {
	value?: number
	onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function RangeSlider({ value, onChange }: RangeSliderProps) {
	const debouncedOnChange = useCallback(debounce(100, onChange), [])

	return (
		<Input
			type="range"
			min="0"
			max="100"
			defaultValue={value}
			onChange={evt => debouncedOnChange(evt.target.value)}
		/>
	)
}

const Input = styled.input`
	width: 100%;
	height: 15px;
	border-radius: 5px;
	background: #d3d3d3;
	outline: none;
	opacity: 0.7;
	transition: opacity 0.2s;

	&:hover {
		opacity: 1;
	}

	&::-webkit-slider-thumb {
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: var(--color);
		cursor: pointer;
	}

	&::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: var(--color);
		cursor: pointer;
	}
`
