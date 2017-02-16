import { number } from './validators'

/*
 Here are common formats that can be attached to Form components
*/

export let percentage = {
	suffix: '%',
	human: value => value + ' ' + '%',
	validator: number
}

export let euro = {
	suffix: '€',
	human: value => value + ' ' + '€',
	validator: number
}

export let months = {
	suffix: 'mois',
	human: value => value + ' ' + 'mois',
	validator: number
}
