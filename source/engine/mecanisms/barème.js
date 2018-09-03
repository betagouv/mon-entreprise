import { val } from 'Engine/traverse-common-functions'

export let trancheValue = (assiette, multiplicateur) => ({
	de: min,
	à: max,
	taux
}) =>
	val(assiette) < min * val(multiplicateur)
		? 0
		: (Math.min(val(assiette), max * val(multiplicateur)) -
				min * val(multiplicateur)) *
		  val(taux)
