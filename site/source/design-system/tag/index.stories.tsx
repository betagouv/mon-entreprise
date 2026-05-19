import { Meta, StoryObj } from '@storybook/react'

import { Tag } from '.'
import {
	CarretDownIcon,
	CarretUpIcon,
	CircleIcon,
	EditIcon,
	ErrorIcon,
	HelpIcon,
	HexagonIcon,
	InfoIcon,
	ReturnIcon,
	RhombusIcon,
	SearchIcon,
	SquareIcon,
	SuccessIcon,
	TriangleIcon,
} from '../icons'

const meta: Meta<typeof Tag> = {
	component: Tag,
}

export default meta

type Story = StoryObj<typeof Tag>

export const Couleurs: Story = {
	render: () => (
		<>
			<Tag>Par défaut</Tag>
			&nbsp;
			<Tag color="primary">primary</Tag>
			&nbsp;
			<Tag color="secondary">secondary</Tag>
			&nbsp;
			<Tag color="tertiary">tertiary</Tag>
			<br />
			<br />
			<Tag color="employeur">employeur</Tag>
			&nbsp;
			<Tag color="particulier">particulier</Tag>
			&nbsp;
			<Tag color="independant">independant</Tag>
			&nbsp;
			<Tag color="artisteAuteur">artisteAuteur</Tag>
			&nbsp;
			<Tag color="marin">marin</Tag>
			<br />
			<br />
			<Tag color="grey">grey</Tag>
			&nbsp;
			<Tag color="error">error</Tag>
			&nbsp;
			<Tag color="success">success</Tag>
			&nbsp;
			<Tag color="info">info</Tag>
			&nbsp;
			<Tag color="dark">dark</Tag>
		</>
	),
}
export const Icones: Story = {
	render: () => (
		<>
			<Tag>
				Par défaut&nbsp;
				<RhombusIcon />
			</Tag>
			&nbsp;
			<Tag color="primary">
				primary&nbsp;
				<HexagonIcon />
			</Tag>
			&nbsp;
			<Tag color="secondary">
				secondary&nbsp;
				<CircleIcon />
			</Tag>
			&nbsp;
			<Tag color="tertiary">
				tertiary&nbsp;
				<TriangleIcon />
			</Tag>
			<br />
			<br />
			<Tag color="employeur">
				employeur&nbsp;
				<SquareIcon />
			</Tag>
			&nbsp;
			<Tag color="particulier">
				particulier&nbsp;
				<CarretDownIcon />
			</Tag>
			&nbsp;
			<Tag color="independant">
				independant&nbsp;
				<CarretUpIcon />
			</Tag>
			&nbsp;
			<Tag color="artisteAuteur">
				artisteAuteur&nbsp;
				<EditIcon />
			</Tag>
			&nbsp;
			<Tag color="marin">
				marin&nbsp;
				<HelpIcon />
			</Tag>
			<br />
			<br />
			<Tag color="grey">
				grey&nbsp;
				<SearchIcon />
			</Tag>
			&nbsp;
			<Tag color="error">
				error&nbsp;
				<ErrorIcon />
			</Tag>
			&nbsp;
			<Tag color="success">
				success&nbsp;
				<SuccessIcon />
			</Tag>
			&nbsp;
			<Tag color="info">
				info&nbsp;
				<InfoIcon />
			</Tag>
			&nbsp;
			<Tag color="dark">
				dark&nbsp;
				<ReturnIcon />
			</Tag>
		</>
	),
}
