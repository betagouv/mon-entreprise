import emoji from 'react-easy-emoji'
import React, { useState } from 'react'
import { Question, BooleanQuestion } from 'Components/conversation/Question'
import { StackedBarChartTest } from 'Components/StackedBarChart'

type State = Partial<{
	nbChildren: string
	nbDependantChildren: string
	isSick: boolean
	isBorn: boolean
	isPreterm: boolean
	nbDaysPreterm: number
	childIsHopitalized: boolean
	childBirthDate: string
}>

export default function Maternité() {
	const [state, setState] = useState<State>({ nbDaysPreterm: 0 })
	const bind = <Key extends keyof State>(key: Key) => ({
		currentValue: state[key],
		onChange: (val: State[Key]) => setState(s => ({ ...s, [key]: val }))
	})
	const today = new Date()
	const pad = (n: number): string => (+n < 10 ? `0${n}` : '' + n)
	const today_start_calendar =
		today.getFullYear() +
		'-' +
		pad(today.getMonth() + 1) +
		'-' +
		today.getDate()
	let {
		date_start_prenatal,
		date_fin_postnatal,
		postnatal,
		prenatal
	} = Result({ state })
	return (
		<>
			<h1>Simulateur de congé maternité {emoji('👶')}</h1>
			Pour percevoir des indémnités journalières, vous devez prendre au minimum
			8 semaines de congés : 2 semaines en prénatal et 6 en posnatal.
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
						{(postnatal + prenatal) % 7 === 0
							? `${Math.trunc((postnatal + prenatal) / 7)} semaines`
							: `${Math.trunc(
									(postnatal + prenatal) / 7
							  )} semaines et ${(postnatal + prenatal) % 7} jours`}
					</li>
					<li>
						<strong>Congé prénatal :</strong>{' '}
						{prenatal % 7 === 0
							? `${Math.trunc(prenatal / 7)} semaines`
							: ` ${Math.trunc(prenatal / 7)} semaines et ${prenatal %
									7} jours`}
					</li>
					<li>
						<strong>Congé posnatal :</strong>{' '}
						{postnatal % 7 === 0
							? state.childBirthDate
								? `${Math.trunc(
										postnatal / 7
								  )} semaines c'est-à-dire jusqu'au ${date_fin_postnatal}`
								: `${Math.trunc(postnatal / 7)} semaines`
							: state.childBirthDate
							? `${Math.trunc(postnatal / 7)} semaines et ${postnatal %
									7} jours c'est-à-dire jusqu'au ${date_fin_postnatal}`
							: `${Math.trunc(postnatal / 7)} semaines et ${postnatal %
									7} jours`}
					</li>
				</ul>
			</div>
			<Question
				question="Nombre d'enfants à naître ?"
				choices={[
					{ value: '1' },
					{ value: '2' },
					{ value: '3', label: '3 et plus' }
				]}
				{...bind('nbChildren')}
			/>
			{state.nbChildren === '1' && (
				<Question
					question="Combien d'enfants avez-vous déjà à charge ?"
					choices={[
						{ value: '0', label: '0 ou 1' },
						{ value: '2', label: '3 ou plus' }
					]}
					{...bind('nbDependantChildren')}
				/>
			)}
			<BooleanQuestion
				question="Avez-vous une maladie liée à la grossesse ?"
				{...bind('isSick')}
			/>
			<BooleanQuestion
				question="L'accouchement a-t-il déjà eu lieu ?"
				{...bind('isBorn')}
			/>
			{state.isBorn ? (
				<>
					<p> Quand l'accouchement a-t-il eu lieu ? </p>
					<input
						type="date"
						id="start"
						name="trip-start"
						value={state.childBirthDate ?? '2019-01-01'}
						pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
						onChange={event => {
							const val = event.target.value
							setState(state => ({
								...state,
								childBirthDate: val
							}))
						}}
					/>
				</>
			) : (
				<>
					<p> Quand l'accouchement est-il prévu ?</p>
					<input
						type="date"
						id="start"
						name="trip-start"
						value={state.childBirthDate ?? today_start_calendar}
						min={today_start_calendar}
						pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
						onChange={event => {
							const val = event.target.value
							setState(state => ({
								...state,
								childBirthDate: val
							}))
						}}
					/>
				</>
			)}
			{state.isBorn && (
				<BooleanQuestion
					question="L'enfant est-il né prématuré ?"
					{...bind('isPreterm')}
				/>
			)}
			{state.isPreterm && (
				<>
					<p> De combien de jours l'enfant est-il né prématuré ?</p>
					<input
						type="text"
						name="nbDaysPreterm"
						value={state.nbDaysPreterm ?? ''}
						onChange={event => {
							const val = event.target.value
							Number(val)
								? setState(state => ({
										...state,
										nbDaysPreterm: Number(val)
								  }))
								: setState(state => ({
										...state,
										nbDaysPreterm: 0
								  }))
						}}
					/>
				</>
			)}
			{state.nbDaysPreterm > 42 && (
				<BooleanQuestion
					question="L'enfant a-t-il du être hospitalisé après l'accouchement ?"
					{...bind('childIsHopitalized')}
				/>
			)}
			<div>
				<StackedBarChartTest
					data={[
						{
							value: prenatal,
							startDate: state.childBirthDate ? date_start_prenatal : '',
							endDate: state.childBirthDate
								? formatage_date(state.childBirthDate)
								: '',
							key: 'prenatal',
							legend: 'Congé prenatal',
							color: '#549f72'
						},
						{
							value: postnatal,
							endDate: state.childBirthDate ? date_fin_postnatal : '',
							key: 'postnatal',
							legend: 'Congé postnatal',
							color: '#5a8adb'
						}
					]}
				/>
			</div>
		</>
	)
}

function Result({ state }: { state: State }) {
	//Number of dependent and unborn children
	let prenatal =
		state.nbChildren === '3'
			? 24 * 7
			: state.nbChildren === '2'
			? 12 * 7
			: state.nbDependantChildren === '2'
			? 8 * 7
			: 6 * 7
	let postnatal =
		state.nbChildren === '3'
			? 22 * 7
			: state.nbChildren === '2'
			? 22 * 7
			: state.nbDependantChildren === '2'
			? 18 * 7
			: 10 * 7

	//Pregnancy-related illness
	prenatal += state.isSick ? 2 * 7 : 0
	postnatal += state.isSick ? 4 * 7 : 0

	//Preterm and Child Hospitalized after ChildBirth
	postnatal += state.isPreterm
		? state.childIsHopitalized
			? state.nbDaysPreterm
			: Math.min(42, state.nbDaysPreterm)
		: 0

	let date_fin_postnatal = new Date()
	let date_start_prenatal = new Date()
	const childBirthDate = new Date(state.childBirthDate)
	date_fin_postnatal.setDate(childBirthDate.getDate() + postnatal)
	date_start_prenatal.setDate(childBirthDate.getDate() - prenatal)

	return {
		date_start_prenatal: formatage_date(date_start_prenatal),
		date_fin_postnatal: formatage_date(date_fin_postnatal),
		postnatal,
		prenatal
	}
}

function formatage_date(date) {
	const pad = (n: number): string => (+n < 10 ? `0${n}` : '' + n)
	const dt = new Date(date)
	return (
		pad(dt.getDate()) + '/' + pad(dt.getMonth() + 1) + '/' + dt.getFullYear()
	)
}
