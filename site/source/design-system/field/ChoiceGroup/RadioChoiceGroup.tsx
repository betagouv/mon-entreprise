import { useRadioGroup } from '@react-aria/radio'
import { useRadioGroupState } from '@react-stately/radio'
import { AriaRadioGroupProps } from '@react-types/radio'
import React, { Fragment, Key, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ChoiceOption, InfoButton } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Radio } from '@/design-system/field/Radio'
import { RadioContext } from '@/design-system/field/Radio/Radio'

export interface RadioChoiceGroupProps {
	id?: string
	value?: string
	onChange: (value: Key) => void
	autoFocus?: boolean
	defaultValue?: string
	aria?: {
		labelledby?: string
		label?: string
	}
	options: Array<ChoiceOption>
}

export default function RadioChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	aria = {},
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
		>
			{options.map((option) => (
				<Fragment key={option.key}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
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
				</Fragment>
			))}
		</RadioGroup>
	)
}

type RadioGroupProps = AriaRadioGroupProps & {
	children: React.ReactNode
}
function RadioGroup(props: RadioGroupProps) {
	const { children, label } = props
	const state = useRadioGroupState(props)
	const { radioGroupProps, labelProps } = useRadioGroup(props, state)

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
			{label && <span {...labelProps}>{label}</span>}
			<RadioGroupContainer $orientationMode={props.orientation ?? 'vertical'}>
				<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
			</RadioGroupContainer>
		</div>
	)
}

const RadioGroupContainer = styled.div<{
	$orientationMode: 'horizontal' | 'vertical'
}>`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${({ $orientationMode }) =>
		$orientationMode === 'horizontal' ? 'row' : 'column'};
`
