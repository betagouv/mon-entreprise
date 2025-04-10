import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Option } from 'effect'

import {
	RegimeCotisation,
	SituationLocationCourteDuree,
} from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { EuroParAn, eurosParAn } from '@/domaine/Montant'

export const initialLocationDeMeubleState: SituationLocationCourteDuree = {
	_tag: 'Situation',
	recettes: Option.none(),
	regimeCotisation: Option.none(),
	estAlsaceMoselle: Option.none(),
	premièreAnnée: Option.none(),
}

export const locationDeMeubleSlice = createSlice({
	name: 'locationDeMeuble',
	initialState: initialLocationDeMeubleState,
	reducers: {
		setRecettes: (state, action: PayloadAction<Option.Option<EuroParAn>>) => {
			state.recettes = action.payload
		},

		setRegimeCotisation: (
			state,
			action: PayloadAction<Option.Option<RegimeCotisation>>
		) => {
			state.regimeCotisation = action.payload
		},

		setEstAlsaceMoselle: (
			state,
			action: PayloadAction<Option.Option<boolean>>
		) => {
			state.estAlsaceMoselle = action.payload
		},

		setPremiereAnnee: (
			state,
			action: PayloadAction<Option.Option<boolean>>
		) => {
			state.premièreAnnée = action.payload
		},

		setSituation: (
			state,
			action: PayloadAction<SituationLocationCourteDuree>
		) => {
			return action.payload
		},

		reset: () => initialLocationDeMeubleState,
	},
})

export const {
	setRecettes,
	setRegimeCotisation,
	setEstAlsaceMoselle,
	setPremiereAnnee,
	setSituation,
	reset,
} = locationDeMeubleSlice.actions

export const setRecettesValue = (value: EuroParAn) =>
	setRecettes(Option.some(value))

export const setRecettesNumber = (value: number) =>
	setRecettes(Option.some(eurosParAn(value)))

export const setRegimeCotisationValue = (value: RegimeCotisation) =>
	setRegimeCotisation(Option.some(value))

export const setEstAlsaceMoselleValue = (value: boolean) =>
	setEstAlsaceMoselle(Option.some(value))

export const setPremiereAnneeValue = (value: boolean) =>
	setPremiereAnnee(Option.some(value))

export const clearRecettes = () => setRecettes(Option.none())
export const clearRegimeCotisation = () => setRegimeCotisation(Option.none())
export const clearEstAlsaceMoselle = () => setEstAlsaceMoselle(Option.none())
export const clearPremiereAnnee = () => setPremiereAnnee(Option.none())

export default locationDeMeubleSlice.reducer
