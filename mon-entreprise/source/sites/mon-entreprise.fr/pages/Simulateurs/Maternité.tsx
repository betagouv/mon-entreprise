import emoji from 'react-easy-emoji'
import React, { useState } from 'react'
import { Question, BooleanQuestion } from 'Components/conversation/Question'

type State = Partial<{
	isAdopted: boolean
	nbChildren: string
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
			<Result state={state} />
			<BooleanQuestion
				question="S'agit-il d'un enfant adopté"
				{...bind('isAdopted')}
			/>
			<Question
				question="Nombre d'enfants à naître ?"
				choices={[
					{ value: '1' },
					{ value: '2' },
					{ value: '3', label: '3 et plus' }
				]}
				{...bind('nbChildren')}
			/>
		</>
	)
}

function Result({ state }: { state: State }) {
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
					<strong>Durée du congé :</strong>{' '}
					{state.isAdopted ? '2 mois' : '3 mois'}
				</li>
			</ul>
		</div>
	)
}
