import React from 'react'
const STATES = [
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
	'Suisse'
]

export default function SelectEuropeCountry({ value, onChange, onSubmit }) {
	return (
		<div>
			<select
				name="country"
				className="ui__"
				defaultValue={value?.slice(1, -1)}
				onChange={e => onChange(`'${e.target.value}'`)}
			>
				{STATES.map(state => (
					<option key={state} value={state}>
						{state}
					</option>
				))}
			</select>
		</div>
	)
}
