import { FC } from 'react'
import { styled } from 'styled-components'

import {
	CircleIcon,
	Colors,
	HexagonIcon,
	Tag,
	TriangleIcon,
} from '@/design-system'

import { RegimeCotisation } from '../domaine/location-de-meublé/situation'

export const RÉGIME_DATA = {
	RG: {
		color: 'primary',
		libellé: 'Régime général',
		abréviation: 'RG',
		icône: HexagonIcon,
	},
	AE: {
		color: 'tertiary',
		libellé: 'Auto-entrepreneur',
		abréviation: 'AE',
		icône: CircleIcon,
	},
	TI: {
		color: 'independant',
		libellé: 'Travailleur indépendant',
		abréviation: 'TI',
		icône: TriangleIcon,
	},
} satisfies {
	[key: string]: {
		color: Colors
		libellé: string
		abréviation: string
		icône: FC
	}
}

export type RégimeType = keyof typeof RÉGIME_DATA

const mapRégimeCotisationToTag = (régime: RegimeCotisation): RégimeType => {
	switch (régime) {
		case RegimeCotisation.regimeGeneral:
			return 'RG'
		case RegimeCotisation.microEntreprise:
			return 'AE'
		case RegimeCotisation.travailleurIndependant:
			return 'TI'
	}
}

const StyledTag = styled(Tag)`
	margin: 0 0.25rem;

	svg {
		margin-right: 0.25rem;
		width: 1rem;
		height: 1rem;
	}
`

interface RégimeTagProps {
	régime: RegimeCotisation
	affichage?: 'abréviation' | 'libellé'
	className?: string
}

export const RégimeTag = ({
	régime,
	affichage = 'abréviation',
	className,
}: RégimeTagProps) => {
	const régimeTag = mapRégimeCotisationToTag(régime)
	const Icône = RÉGIME_DATA[régimeTag].icône

	return (
		<StyledTag color={RÉGIME_DATA[régimeTag].color} sm className={className}>
			<Icône />
			{affichage === 'abréviation' ? (
				<abbr title={RÉGIME_DATA[régimeTag].libellé}>
					{RÉGIME_DATA[régimeTag].abréviation}
				</abbr>
			) : (
				RÉGIME_DATA[régimeTag][affichage]
			)}
		</StyledTag>
	)
}
