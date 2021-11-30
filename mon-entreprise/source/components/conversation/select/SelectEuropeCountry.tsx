import { Item, Select } from 'DesignSystem/field/Select'
import { InputProps } from '../RuleInput'

const states = [
	'Allemagne',
	'Autriche',
	'Belgique',
	'Bulgarie',
	'Chypre',
	'Croatie',
	'Danemark',
	'Espagne',
	'Estonie',
	'Finlande',
	'Grèce',
	'Hongrie',
	'Irlande',
	'Islande',
	'Italie',
	'Lettonie',
	'Liechtenstein',
	'Lituanie',
	'Luxembourg',
	'Malte',
	'Norvège',
	'Pays-Bas',
	'Pologne',
	'Portugal',
	'République Tchèque',
	'Roumanie',
	'Royaume-Uni',
	'Slovaquie',
	'Slovénie',
	'Suède',
	'Suisse',
	'Autre',
]

const statesWithID = states.map((name, id) => ({
	name,
	id,
}))

export default function SelectEuropeCountry({
	value,
	onChange,
	id,
}: InputProps) {
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
