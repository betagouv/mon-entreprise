import { useRadioGroup } from '@react-aria/radio'
import { useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import React, { Key, useEffect } from 'react'
import { css, styled } from 'styled-components'

import { FlexCenter } from '@/design-system/global-style'
import { H5 } from '@/design-system/typography'

import { Emoji } from '../../../emoji'
import { InfoButton } from '../../../InfoButton'
import { Radio } from '../Radio'
import { RadioContext } from '../Radio/Radio'
import { ChoiceOption, isChoiceOptionWithValue } from './ChoiceOption'

export interface RadioChoiceGroupProps {
	id?: string
	value?: string
	label?: string
	description?: string
	onChange: (value: Key) => void
	autoFocus?: boolean
	defaultValue?: string
	aria?: {
		labelledby?: string
	}
	options: Array<ChoiceOption>
	isSubRadioGroup?: boolean
}

export default function RadioChoiceGroup({
	value,
	label,
	description,
	onChange,
	autoFocus,
	defaultValue,
	options,
	aria = {},
	isSubRadioGroup = false,
}: RadioChoiceGroupProps) {
	return (
		<RadioGroup
			aria-labelledby={aria.labelledby}
			onChange={onChange}
			value={value}
			label={label}
			description={description}
			isSubRadioGroup={isSubRadioGroup}
		>
			{options.map((option) =>
				isChoiceOptionWithValue(option) ? (
					<div
						key={option.key}
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<Radio
							value={option.value}
							/* eslint-disable-next-line jsx-a11y/no-autofocus */
							autoFocus={autoFocus && defaultValue === option.value}
							isDisabled={option.isDisabled}
							defaultSelected={option.isDefaultSelected}
						>
							{option.label}
						</Radio>
						{option.emoji && <Emoji emoji={option.emoji} />}{' '}
						{option.description && (
							<InfoButton
								light
								title={option.label.toString()}
								description={option.description}
							/>
						)}
					</div>
				) : (
					<RadioChoiceGroup
						key={option.label}
						label={option.label}
						description={option.description}
						isSubRadioGroup={true}
						value={value}
						onChange={onChange}
						options={option.children}
						/* eslint-disable-next-line jsx-a11y/no-autofocus */
						autoFocus={autoFocus}
						defaultValue={defaultValue}
						aria={aria}
					/>
				)
			)}
		</RadioGroup>
	)
}

type RadioGroupProps = AriaRadioGroupProps & {
	label?: string
	children: React.ReactNode
	description?: string
	isSubRadioGroup?: boolean
}
function RadioGroup(props: RadioGroupProps) {
	const { children, label, description, isSubRadioGroup } = props
	const state = useRadioGroupState(props)
	// Code mysteriously crashes if this hook is removed:
	useRadioGroup(props, state)

	useEffect(() => {
		if (!props.value) {
			state.setSelectedValue('')
		}
	}, [props.value, state])

	return (
		<>
			{label && (
				<StyledH5 as="p">
					{label}
					{description && (
						<InfoButton light title={label} description={description} />
					)}
				</StyledH5>
			)}
			<RadioGroupContainer
				$orientationMode={props.orientation ?? 'vertical'}
				$isSubGroup={isSubRadioGroup}
			>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</RadioGroupContainer>
		</>
	)
}

const StyledH5 = styled(H5)`
	${FlexCenter}
	margin-top: ${({ theme }) => theme.spacings.xs};
`

const RadioGroupContainer = styled.div<{
	$orientationMode: 'horizontal' | 'vertical'
	$isSubGroup?: boolean
}>`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${({ $orientationMode }) =>
		$orientationMode === 'horizontal' ? 'row' : 'column'};
	${({ $isSubGroup }) =>
		$isSubGroup &&
		css`
			padding-left: ${({ theme }) => theme.spacings.md};
			border-left: 2px dotted ${({ theme }) => theme.colors.extended.grey[500]};
		`}
`
