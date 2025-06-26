import { Item } from '@/design-system'
import { Select } from '@/design-system/field/Select'

import { InputProps } from '../RuleInput'

const STATES = [
	'Allemagne',
	'Andorre',
	'Argentine',
	'Autriche',
	'Belgique',
	'Brésil',
	'Bulgarie',
	'Canada',
	'Chili',
	'Chypre',
	'Corée du sud',
	'Croatie',
	'Danemark',
	'Espagne',
	'Estonie',
	'États-Unis',
	'Finlande',
	'Grèce',
	'Hongrie',
	'Inde',
	'Irlande',
	'Islande',
	'Italie',
	'Japon',
	'Lettonie',
	'Liechtenstein',
	'Lituanie',
	'Luxembourg',
	'Malte',
	'Maroc',
	'Norvège',
	'Nouvelle Calédonie',
	'Pays-Bas',
	'Pologne',
	'Polynésie',
	'Portugal',
	'Québec',
	'République Tchèque',
	'Roumanie',
	'Royaume-Uni',
	'Saint Pierre et Miquelon',
	'Slovaquie',
	'Slovénie',
	'Suède',
	'Suisse',
	'Tunisie',
	'Uruguay',
	'Autre',
]

export default function SelectPaysDétachement({
	value,
	onChange,
	id,
	plusFrance = false,
}: InputProps & { plusFrance: boolean }) {
	const states = plusFrance ? ['France', ...STATES] : STATES
	const statesWithID = states.map((name, id) => ({
		name,
		id,
	}))

	const valueId = value
		? statesWithID.find((s) => s.name === value)?.id
		: undefined

	return (
		<Select
			name="country"
			items={statesWithID}
			id={id}
			defaultSelectedKey={valueId}
			onSelectionChange={(k) => {
				const state = statesWithID.find((s) => s.id === k)
				state && onChange(`'${state.name}'`)
			}}
			label="Pays"
		>
			{(state) => <Item textValue={state.name}>{state.name}</Item>}
		</Select>
	)
}
