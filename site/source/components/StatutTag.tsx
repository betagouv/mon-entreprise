import { FC } from 'react'
import styled from 'styled-components'

import {
	CircleIcon,
	HexagonIcon,
	RhombusIcon,
	SquareIcon,
	TriangleIcon,
} from '@/design-system/icons'
import { Tag } from '@/design-system/tag'
import { Colors } from '@/design-system/theme'

const TAG_DATA = {
	EI: {
		color: 'independant',
		longName: 'Entreprise individuelle',
		acronym: 'EI',
		icon: TriangleIcon,
	},
	AE: {
		color: 'tertiary',
		longName: 'Auto-entrepreneur',
		acronym: 'AE',
		icon: CircleIcon,
	},
	SASU: {
		color: 'secondary',
		longName: 'Société par actions simplifiée unipersonnelle',

		acronym: 'SASU',
		icon: HexagonIcon,
	},
	SAS: {
		color: 'secondary',
		longName: 'Société par actions simplifiée',
		acronym: 'SAS',
		icon: HexagonIcon,
	},
	EURL: {
		color: 'artisteAuteur',
		longName: 'Entreprise unipersonnelle à responsabilité limitée',
		acronym: 'EURL',
		icon: RhombusIcon,
	},
	SARL: {
		color: 'artisteAuteur',
		longName: 'Société à responsabilité limitée',
		acronym: 'SARL',
		icon: RhombusIcon,
	},
	SELARLU: {
		color: 'marin',
		longName:
			"Société d'exercice libéral à responsabilité limitée unipersonnelle",
		acronym: 'SELARLU',
		icon: RhombusIcon,
	},
	SELARL: {
		color: 'marin',
		longName: "Société d'exercice libéral à responsabilité limitée",
		acronym: 'SELARL',
		icon: RhombusIcon,
	},
	SELAS: {
		color: 'marin',
		longName: "Société d'exercice libéral par action simplifiée",
		acronym: 'SELAS',
		icon: HexagonIcon,
	},
	SELASU: {
		color: 'marin',
		longName: "Société d'exercice libéral par action simplifiée unipersonnelle",
		acronym: 'SELASU',
		icon: HexagonIcon,
	},
	association: {
		color: 'primary',
		longName: 'Association',
		acronym: 'Assoc.',
		icon: SquareIcon,
	},
} satisfies {
	[key: string]: {
		color: Colors
		longName: string
		acronym: string
		icon: FC
	}
}

export type Statut = keyof typeof TAG_DATA

const StyledTag = styled(Tag)`
	margin: 0 0.25rem;

	svg {
		margin-right: 0.25rem;
		width: 1rem;
		height: 1rem;
	}
	svg.square-icon {
		width: 0.8rem;
		height: 0.8rem;
	}
`

interface StatutTagProps {
	statut: Statut
	text: 'acronym' | 'longName'
	showIcon?: boolean
}

export const StatutTag = ({ statut, text, showIcon }: StatutTagProps) => {
	const Icon = TAG_DATA[statut].icon

	return (
		<StyledTag color={TAG_DATA[statut].color} sm>
			{showIcon && <Icon />}
			{TAG_DATA[statut][text]}
		</StyledTag>
	)
}
