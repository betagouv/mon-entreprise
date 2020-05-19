import emoji from 'react-easy-emoji'
import React, { useState } from 'react'
import { Question, BooleanQuestion } from 'Components/conversation/Question'
import { StackedBarChartTest } from 'Components/StackedBarChart'
import { Explicable } from 'Components/conversation/Explicable'
import StatutDescription from '../Créer/StatutDescription'
import { mapAccumRight } from 'ramda'

type State = Partial<{
	nbChildren: string
	nbDependantChildren: string
	pregnancyRelatedIllness: boolean
	childBirthRelatedIllness: boolean
	isBorn: boolean
	isPreterm: boolean
	nbDaysPreterm: number
	childIsHospitalized: boolean
	childBirthDate: string
	isSharedLeaveAdotption: boolean
	childLongHospitalized: boolean
	advancePrenatalLeave: boolean
	nbDaysAdvancePrenatal: number
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
		min_date_fin_postnatal,
		min_date_start_prenatal,
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
						{ value: '2', label: '2 ou plus' }
					]}
					{...bind('nbDependantChildren')}
				/>
			)}
			<BooleanQuestion
				question="Avez-vous une pathologie liée à la grossesse ?"
				explication="Si la grossesse pathologique est due à une exposition de la mère in utero au distilbène, le congé de maternité débute le 1er jour d'arrêt de travail et peut durer jusqu'au congé prénatal normal."
				{...bind('pregnancyRelatedIllness')}
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
			{!state.isBorn &&
				(state.nbChildren === '2' ||
					state.nbChildren === '3' ||
					state.nbDependantChildren == '2') && (
					<BooleanQuestion
						question="Souhaitez-vous avancer le début de votre congé prénatal ?"
						explication={`
						Vous pouvez avancer votre congé prénatal jusqu'à ${
							!state.isBorn &&
							(state.nbChildren === '2' || state.nbChildren === '3')
								? 4
								: 2
						} semaines. La
						durée du congé postnatal sera réduite d'autant de jours`}
						{...bind('advancePrenatalLeave')}
					/>
				)}
			{state.advancePrenatalLeave && (
				<>
					<p>De combien de jours souhaitez-vous avancer le congé prénatal ? </p>
					<input
						type="text"
						name="nbDaysAdvancePrenatal"
						value={state.nbDaysAdvancePrenatal ?? 0}
						max={
							state.nbChildren === '2' || state.nbChildren === '3'
								? 4 * 7
								: 2 * 7
						}
						onChange={event => {
							const val = event.target.value
							Number(val)
								? setState(state => ({
										...state,
										nbDaysAdvancePrenatal: Number(val)
								  }))
								: setState(state => ({
										...state,
										nbDaysAdvancePrenatal: 0
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
			{state.isBorn && (
				<BooleanQuestion
					question="Avez-vous une pathologie liée à l'accouchement ?"
					{...bind('childBirthRelatedIllness')}
				/>
			)}
			{state.isPreterm && (
				<>
					<p> De combien de jours l'enfant est-il né prématuré ?</p>
					<input
						type="text"
						name="nbDaysPreterm"
						value={state.nbDaysPreterm ?? 0}
						max={140}
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
			<div
				css={`
					margin: 3rem 0px;
				`}
			>
				<h3>
					Résultats :{' '}
					<Explicable>
						<ul>
							{state.pregnancyRelatedIllness && (
								<li>
									{' '}
									Du fait de la pathologie liée à la grossesse, 2 semaines de
									congé avant le congé prénatal sont ici compatabilisées. Ce
									congé supplémentaire peut être prescrit à tout moment à partir
									de la déclaration de la grossesse et être pris en plusieurs
									périodes.
								</li>
							)}
							{state.childBirthRelatedIllness && (
								<li>
									{' '}
									Du fait de la pathologie liée à l'accouchement, 4 semaines de
									congé après le congé postnatal sont ici comptabilisées. Elles
									peuvent être accordées sur prescription médicale.
								</li>
							)}
							<li>
								{' '}
								La travailleuse indépendant en congé maternité pourra reprendre
								son activité en temps partiel : 1 jour par semaine pendant les 4
								semaines suivants la période minimale d'interruption d'activité
								de 8 semaines puis 2 jours par semaines pendant les 4 semaines
								suivantes.
							</li>
							<li>
								Vous pouvez demander à votre médecin de reporter une partie de
								votre congé prénatal sur votre congé posnatal dans la limite de
								3 semaines. En cas d'arrêt maladie prescrit pendant la période
								de report, le report est annulé que cet arrêt de travail soit en
								lien ou non avec la grossesse.{' '}
							</li>
							<li>
								En cas d'hospitalisation de l'enfant au-delà de la 6e semaine
								après sa naissance, la mère peut choisir de reprendre son
								travail. Elle devra prendre la période de congé postnatal non
								utilisée dès la fin de l'hospitalisation de l'enfant.{' '}
							</li>
							<li>
								Lorsque l'enfant décède après sa naissance, la mère conserve son
								congé postnatal. En cas de décès lié à une naissance prématurée,
								la mère a droit au congé de maternité en totalité si l'enfant
								est né viable. Le seuil de viabilité se situe à 22 semaines
								d'aménorrhée ou si le fœtus pesait au moins 500 grammes. Dans le
								cas contraire, la mère est placée en congé de maladie ordinaire.
							</li>
						</ul>
					</Explicable>{' '}
				</h3>
				<StackedBarChartTest
					data={[
						{
							value: prenatal - 14,
							startDate: state.childBirthDate
								? new Date(date_start_prenatal).toLocaleString('default', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
								  })
								: '',
							key: 'prenatal',
							legend: 'Congé prénatal',
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
							value: 14,
							key: 'obligatoire prenatal',
							topTickLeft: 'Congé prénatal minimal',
							startDate: state.childBirthDate
								? new Date(min_date_start_prenatal).toLocaleString('default', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
								  })
								: '',
							endDate: state.childBirthDate
								? new Date(state.childBirthDate).toLocaleString('default', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
								  })
								: 'Accouchement',
							color: '#549f72'
						},
						{
							value: 42,
							key: 'min postnatal',
							topTickRight: 'Congé postnatal minimal',
							endDate: state.childBirthDate
								? new Date(min_date_fin_postnatal).toLocaleString('default', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
								  })
								: '',
							color: '#5a8adb'
						},
						{
							value: postnatal - 42,
							endDate: state.childBirthDate
								? new Date(date_fin_postnatal).toLocaleString('default', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
								  })
								: '',
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

	//Pregnancy-related or ChildBrith-related illness
	prenatal += state.pregnancyRelatedIllness ? 2 * 7 : 0
	postnatal += state.childBirthRelatedIllness ? 4 * 7 : 0

	//Preterm and Child Hospitalized after ChildBirth
	postnatal +=
		state.isPreterm && state.childIsHospitalized
			? state.nbDaysPreterm
			: Math.min(42, state.nbDaysPreterm)

	prenatal -= state.isPreterm ? state.nbDaysPreterm : 0

	let date_fin_postnatal = new Date()
	let date_start_prenatal = new Date()
	let min_date_start_prenatal = new Date()
	let min_date_fin_postnatal = new Date()
	const childBirthDate = new Date(state.childBirthDate)
	date_fin_postnatal.setDate(childBirthDate.getDate() + postnatal)
	date_start_prenatal.setDate(childBirthDate.getDate() - prenatal)
	min_date_start_prenatal.setDate(childBirthDate.getDate() - 14)
	min_date_fin_postnatal.setDate(childBirthDate.getDate() + 42)

	// Advanced Prenatal Leave
	prenatal += state.advancePrenatalLeave
		? state.nbDaysAdvancePrenatal
			? state.nbChildren === '2' || state.nbChildren == '3'
				? Math.min(28, state.nbDaysAdvancePrenatal)
				: Math.min(14, state.nbDaysAdvancePrenatal)
			: 0
		: 0
	postnatal -= state.advancePrenatalLeave
		? state.nbDaysAdvancePrenatal
			? state.nbChildren === '2' || state.nbChildren == '3'
				? Math.min(28, state.nbDaysAdvancePrenatal)
				: Math.min(14, state.nbDaysAdvancePrenatal)
			: 0
		: 0

	return {
		date_start_prenatal,
		date_fin_postnatal,
		min_date_fin_postnatal,
		min_date_start_prenatal,
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
