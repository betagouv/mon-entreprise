import { useRadioGroup } from '@react-aria/radio'
import { useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import React, { Key, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
		label?: string
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
	const { t } = useTranslation()

	return (
		<RadioGroup
			aria-label={
				aria.label ||
				t('conversation.multiple-answer.aria-label', 'Choix multiples')
			}
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
								aria-label={t("Plus d'informations sur {{ title }}", {
									title: option.label,
								})}
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
	const { radioGroupProps, labelProps } = useRadioGroup(props, state)
	const { t } = useTranslation()

	useEffect(() => {
		if (!props.value) {
			state.setSelectedValue('')
		}
	}, [props.value, state])

	return (
		<div
			/* eslint-disable-next-line react/jsx-props-no-spreading */
			{...radioGroupProps}
			onKeyDown={undefined}
			aria-label={props['aria-label']}
		>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			{label && (
				<StyledH5 as="p" {...labelProps}>
					{label}
					{description && (
						<InfoButton
							light
							title={label}
							description={description}
							aria-label={t("Plus d'informations sur {{ title }}", {
								title: label,
							})}
						/>
					)}
				</StyledH5>
			)}
			<RadioGroupContainer
				$orientationMode={props.orientation ?? 'vertical'}
				$isSubGroup={isSubRadioGroup}
			>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</RadioGroupContainer>
		</div>
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
