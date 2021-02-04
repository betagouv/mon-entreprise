import { InputProps } from '../RuleInput'

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
	'Suisse',
	'Autre',
] as const

export default function SelectEuropeCountry({
	value,
	onChange,
	id,
}: InputProps) {
	return (
		<div>
			<select
				name="country"
				id={id}
				className="ui__"
				defaultValue={value ? (value as string).slice(1, -1) : undefined}
				onChange={(e) => onChange(`'${e.target.value}'`)}
			>
				<option disabled selected hidden></option>
				{STATES.map((state) => (
					<option key={state} value={state}>
						{state}
					</option>
				))}
			</select>
		</div>
	)
}
