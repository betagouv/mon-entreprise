import emoji from 'react-easy-emoji'
import React, { useState } from 'react'
import { Question, BooleanQuestion } from 'Components/conversation/Question'

type State = Partial<{
	nbChildren: string
	nbDependantChildren: string
	isSick: boolean
	isBorn: boolean
	isPreterm: boolean
	nbDaysPreterm: number
}>

export default function Maternité() {
	const [state, setState] = useState<State>({})
	const bind = <Key extends keyof State>(key: Key) => ({
		currentValue: state[key],
		onChange: (val: State[Key]) => setState(s => ({ ...s, [key]: val }))
	})

	return (
		<>
			<h1>Simulateur de congé maternité {emoji('👶')}</h1>
			Pour percevoir des indémnités journalières, vous devez prendre au minimum
			8 semaines de congés : 2 semaines en prénatal et 6 en posnatal.
			<Result state={state} />
			<Question
				question="Nombre d'enfants à naître ?"
				choices={[
					{ value: '1' },
					{ value: '2' },
					{ value: '3', label: '3 et plus' }
				]}
				{...bind('nbChildren')}
			/>
			{state.nbChildren === '1' ? (
				<Question
					question="Combien d'enfants avez-vous déjà à charge ?"
					choices={[
						{ value: '0', label: '0 ou 1' },
						{ value: '2', label: '2 ou plus' }
					]}
					{...bind('nbDependantChildren')}
				/>
			) : null}
			<BooleanQuestion
				question="Avez-vous une maladie liée à la grossesse ?"
				{...bind('isSick')}
			/>
			<BooleanQuestion
				question="L'accouchement a-t-il déjà eu lieu ?"
				{...bind('isBorn')}
			/>
			{state.isBorn ? (
				<BooleanQuestion
					question="L'enfant est-il né prématuré ?"
					{...bind('isPreterm')}
				/>
			) : null}
			{state.isPreterm ? (
				<>
					<p> De combien de jours l'enfant est-il né prématuré ?</p>
					<input
						type="text"
						name="nbDaysPreterm"
						value={state.nbDaysPreterm ?? ''}
						onChange={event => {
							const val = event.target.value
							setState(state => ({
								...state,
								nbDaysPreterm: Number(val)
							}))
						}}
					/>
				</>
			) : null}
		</>
	)
}
//{Number(state.nbDaysPreterm) > 42 >
//	<BooleanQuestion
//	question="L'enfant a-t-il du être hospitalisé après l'accouchement ?"
//	{...bind('childIsHopitalized')}
// />
// }

function Result({ state }: { state: State }) {
	//Number of dependent and unborn children
	let prenatal =
		state.nbChildren === '3'
			? 24
			: state.nbChildren === '2'
			? 12
			: state.nbDependantChildren === '2'
			? 8
			: 6
	let postnatal =
		state.nbChildren === '3'
			? 22
			: state.nbChildren === '2'
			? 22
			: state.nbDependantChildren === '2'
			? 18
			: 10

	//Pregnancy-related illness
	prenatal += state.isSick ? 2 : 0
	postnatal += state.isSick ? 4 : 0

	//Preterm and Child Hospitalized after ChildBirth
	//postnatal += state.isPreterm ? Math.min(42, state.nbDaysPreterm) : 0

	return (
		<div
			css={`
				background-color: var(--lightestColor);
				float: right;
				padding: 1rem;
				width: 300px;
			`}
		>
			<h3>Résulats</h3>
			<ul>
				<li>
					<strong>Durée du congé maternel:</strong>{' '}
					{` ${postnatal + prenatal} semaines`}
				</li>
				<li>
					<strong>Congé prénatal :</strong> {` ${prenatal} semaines`}
				</li>
				<li>
					<strong>Congé posnatal :</strong> {` ${postnatal} semaines`}
					{}
				</li>
			</ul>
		</div>
	)
}
