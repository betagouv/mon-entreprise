/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import TextField from './TextField'

export default {
	component: TextField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof TextField>

type Story = StoryObj<typeof TextField>

const TextFieldWrapper = (args: React.ComponentProps<typeof TextField>) => {
	const [value, setValue] = useState<string>(args.defaultValue || '')

	return (
		<TextField
			{...args}
			onChange={(newValue) => {
				setValue(newValue)
				args.onChange?.(newValue)
			}}
			defaultValue={value}
		/>
	)
}

export const Default: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Text Input',
	},
}

export const WithDescription: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Text Input with Description',
		description: 'This is a description for the text field',
	},
}

export const WithInitialValue: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Text Input with Initial Value',
		defaultValue: 'Initial text value',
	},
}

export const WithPlaceholder: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Text Input with Placeholder',
		placeholder: 'Type something here...',
	},
}

export const WithError: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Text Input with Error',
		errorMessage: 'This field contains an error',
		validationState: 'invalid',
	},
}

export const Small: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Small Text Input',
		small: true,
	},
}

export const WithAutofocus: Story = {
	render: (args) => <TextFieldWrapper {...args} />,
	args: {
		label: 'Text Input with Autofocus',
		autoFocus: true,
	},
}
