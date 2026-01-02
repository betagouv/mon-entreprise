/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { NumberField } from './NumberField'

export default {
	component: NumberField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof NumberField>

type Story = StoryObj<typeof NumberField>

const NumberFieldWrapper = (args: React.ComponentProps<typeof NumberField>) => {
	const [value, setValue] = useState<number | undefined>(args.value)

	return (
		<NumberField
			{...args}
			value={value}
			onChange={(newValue) => {
				setValue(newValue)
				args.onChange?.(newValue)
			}}
		/>
	)
}

export const Default: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Number Input',
	},
}

export const WithDescription: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Number Input with Description',
		description: 'This is a description for the number field',
	},
}

export const WithPlaceholder: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Number Input with Placeholder',
		placeholder: 1000,
	},
}

export const WithInitialValue: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Number Input with Initial Value',
		value: 1500,
	},
}

export const WithFormatting: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Number Input with Formatting',
		value: 1500,
		formatOptions: {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		},
	},
}

export const WithError: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Number Input with Error',
		value: 1500,
		errorMessage: 'This field contains an error',
		validationState: 'invalid',
	},
}

export const Small: Story = {
	render: (args) => <NumberFieldWrapper {...args} />,
	args: {
		label: 'Small Number Input',
		value: 1500,
		small: true,
	},
}
