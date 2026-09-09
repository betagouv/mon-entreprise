import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps, useState } from 'react'

import { RotatingChevronIcon, SvgIcon } from '.'

const meta: Meta<typeof SvgIcon> = {
	component: SvgIcon,
}

export default meta

export {
	ArrowRightIcon,
	CarretDownIcon,
	CarretUpIcon,
	CheckmarkIcon,
	ChevronIcon,
	CircledArrowIcon,
	CircleIcon,
	ClockIcon,
	CrossIcon,
	EditIcon,
	ErrorIcon,
	ExternalLinkIcon,
	EyeIcon,
	GithubIcon,
	HelpIcon,
	HexagonIcon,
	InfoIcon,
	PlusCircleIcon,
	ReturnIcon,
	SearchIcon,
	SquareIcon,
	SuccessIcon,
	TriangleIcon,
	WarningIcon,
} from './'

const RotatingChevronExample = (
	args: ComponentProps<typeof RotatingChevronIcon>
) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<button onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? 'Ouvert' : 'Fermé'}
				<RotatingChevronIcon {...args} isOpen={isOpen} />
			</button>
			{isOpen && <div>Visible si ouvert</div>}
		</>
	)
}

type Story = StoryObj<typeof RotatingChevronExample>

export const Chevron: Story = {
	render: (args) => <RotatingChevronExample {...args} />,
}
