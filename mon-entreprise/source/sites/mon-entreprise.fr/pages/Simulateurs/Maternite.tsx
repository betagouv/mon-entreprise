import emoji from 'react-easy-emoji'
import React, { useState } from 'react'
import { Question, BooleanQuestion } from 'Components/conversation/Question'
import { StackedBarChartTest } from 'Components/StackedBarChart'
import { Explicable } from 'Components/conversation/Explicable'

type State = Partial<{
	nbChildren: string
	nbDependantChildren: string
	isSick: boolean
	isBorn: boolean
	isPreterm: boolean
	nbDaysPreterm: number
	childIsHospitalized: boolean
	childBirthDate: string
	isSharedLeaveAdotption: boolean
	childLongHospitalized: boolean
}>

type LeaveType = Partial<{ leaveType: string }>

export default function Maternité() {
	const [leaveType, setLeaveType] = useState<LeaveType>({})
	const bindLeaveType = <Key extends keyof LeaveType>(key: Key) => ({
		currentValue: leaveType[key],
		onChange: (val: LeaveType[Key]) => setLeaveType(s => ({ ...s, [key]: val }))
	})
	return (
		<>
			<h1>Simulateur de congé maternité {emoji('👶')}</h1>
			<Question
				question="Vous voulez-prendre un ..."
				choices={[
					{ value: 'maternity', label: 'Congé maternité' },
					{
						value: 'paternity',
						label: "Congé paternité et d'accueil d'enfant"
					},
					{ value: 'adoption', label: "Congé d'adoption" }
				]}
				{...bindLeaveType('leaveType')}
			/>
			{leaveType.leaveType === 'adoption' ? (
				<Adoption />
			) : leaveType.leaveType === 'maternity' ? (
				<Maternité2 />
			) : leaveType.leaveType === 'paternity' ? (
				<Paternité />
			) : null}
		</>
	)
}

function Adoption() {
	const [state, setState] = useState<State>({})
	const bind = <Key extends keyof State>(key: Key) => ({
		currentValue: state[key],
		onChange: (val: State[Key]) => setState(s => ({ ...s, [key]: val }))
	})
	let congeAdoption =
		state.nbChildren === '1' ? (state.nbDependantChildren == '0' ? 10 : 18) : 22
	let extraDays = state.isSharedLeaveAdotption
		? state.nbChildren === '1'
			? 11
			: 18
		: 0
	return (
		<>
			<BooleanQuestion
				question="Souhaitez-vous partager votre congé d'adoption avec votre conjoint ?"
				explication="S'il est partagé, le congé d'adoption doit être réparti en deux périodes de temps dont la plus courte doit être au moins de 11 jours. Vous pouvez prendre votre congé d'adoption en même temps que votre conjoint mais la somme de vos deux périodes de congés ne peut dépasser la durée légale du congé d'adoption."
				{...bind('isSharedLeaveAdotption')}
			/>

			<Question
				question="Vous adoptez ..."
				choices={[
					{ value: '1', label: '1 enfant' },
					{ value: '2', label: 'plusieurs enfants' }
				]}
				{...bind('nbChildren')}
			/>

			<Question
				question="Combien d'enfant avez-vous déjà à charge ?"
				explication="Les enfants doivent être à charge effective et permanente https://www.service-public.fr/particuliers/vosdroits/F16947 "
				choices={[
					{ value: '0', label: '0 ou 1 enfant' },
					{ value: '2', label: 'plusieurs enfants' }
				]}
				{...bind('nbDependantChildren')}
			/>

			<div
				css={`
					background-color: var(--lightestColor);
					margin: 2rem 0px;
					padding: 1rem;
				`}
			>
				<h3>Résulats</h3>
				<ul>
					<li>
						{' '}
						<strong>Durée du congé :</strong>
						{state.isSharedLeaveAdotption
							? ` ${congeAdoption} semaines et ${extraDays} jours`
							: ` ${congeAdoption} semaines`}{' '}
					</li>
				</ul>
				<p>
					Ce congé peut précéder de sept jours consécutifs, au plus, l'arrivée
					de l'enfant au foyer.{' '}
				</p>
			</div>
		</>
	)
}

function Maternité2() {
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
			Pour percevoir des indémnités journalières, vous devez prendre au minimum
			8 semaines de congés : 2 semaines en prénatal et 6 en posnatal.
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
						value={state.childBirthDate ?? today_start_calendar}
						max={today_start_calendar}
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
					{...bind('childIsHospitalized')}
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
								: 'Accouchement',
							key: 'prenatal',
							legend: 'Congé prenatal',
							sublegend:
								prenatal % 7 === 0 ? (
									<strong> {Math.trunc(prenatal / 7)} semaines</strong>
								) : (
									<strong>
										{Math.trunc(prenatal / 7)} semaines et {prenatal % 7} jours
									</strong>
								),
							color: '#549f72'
						},
						{
							value: postnatal,
							endDate: state.childBirthDate ? date_fin_postnatal : '',
							key: 'postnatal',
							legend: 'Congé postnatal',
							sublegend:
								postnatal % 7 === 0 ? (
									<strong> {Math.trunc(postnatal / 7)} semaines</strong>
								) : (
									<strong>
										{Math.trunc(postnatal / 7)} semaines et {postnatal % 7}{' '}
										jours
									</strong>
								),
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
		? state.childIsHospitalized
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

function Paternité() {
	const [state, setState] = useState<State>({ nbDaysPreterm: 0 })
	const bind = <Key extends keyof State>(key: Key) => ({
		currentValue: state[key],
		onChange: (val: State[Key]) => setState(s => ({ ...s, [key]: val }))
	})
	const today = new Date()
	const pad = (n: number): string => (+n < 10 ? `0${n}` : '' + n)
	return (
		<>
			<p>
				Le congé de paternité et d'accueil de l'enfant est ouvert à la personne
				vivant en couple (Mariage, Pacs, concubinage) avec la mère de l'enfant.
				Il peut être succéder au congé de naissance de 3 jours ou être pris
				séparément.{' '}
			</p>
			<Question
				question="Nombre d'enfants à naître ?"
				choices={[{ value: '1' }, { value: '2', label: '2 ou plus' }]}
				{...bind('nbChildren')}
			/>

			<BooleanQuestion
				question="L'accouchement a-t-il déjà eu lieu ?"
				{...bind('isBorn')}
			/>
			{state.isBorn && (
				<BooleanQuestion
					question={
						state.nbChildren === '2'
							? 'Un enfant a-t-il été hospitalisé immédiatement après sa naissance dans une unité de soins spécialisés ?'
							: "L'enfant a-t-il été hospitalisé immédiatement après sa naissance dans une unité de soins spécialisés ? "
					}
					{...bind('childIsHospitalized')}
				/>
			)}

			{state.childIsHospitalized && (
				<BooleanQuestion
					question="L'enfant a-t-il été hospitalisé plus de 6 semaines ?"
					{...bind('childLongHospitalized')}
				/>
			)}

			<div
				css={`
					background-color: var(--lightestColor);
					margin: 2rem 0px;
					padding: 1rem;
				`}
			>
				<h3>Résulats </h3>
				<ul>
					<li>
						<strong> Congé de naissance : </strong> 3 jours{' '}
					</li>
					<li>
						<strong>Durée du congé :</strong>
						{` ${state.nbChildren === '1' ? 11 : 18} jours`}
						{state.childLongHospitalized
							? " à prendre dans les 4 mois suivants la fin de l'hospitalisation de l'enfant."
							: ' à prendre dans les 4 mois suivants la naissance.'}
						<Explicable>
							Les jours de congés sont des jours calendaires consécutifs
							(samedi,dimanche et jours fériés compris). Ces congés ne sont pas
							fractionnables. Le congé est aussi accordé en cas de naissance
							d'un enfant sans vie. En cas de décès de la mère il sera accordé à
							l'expiration du congé maternité. Il est accordé au père ou à la
							personne vivant en couple avec la mère de l'enfant si le père de
							l'enfant n'en bénéficie pas.
						</Explicable>{' '}
					</li>
					{state.childIsHospitalized && (
						<>
							<li>
								<strong>
									Congé supplémentaire dû à l'hospitalisation de l'enfant :
								</strong>{' '}
								jusqu'à 30 jours consécutifs pendant la période
								d'hospitalisation.
							</li>
						</>
					)}
				</ul>
			</div>
		</>
	)
}

function formatage_date(date) {
	const pad = (n: number): string => (+n < 10 ? `0${n}` : '' + n)
	const dt = new Date(date)
	return (
		pad(dt.getDate()) + '/' + pad(dt.getMonth() + 1) + '/' + dt.getFullYear()
	)
}
