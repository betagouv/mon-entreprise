import { val } from 'Engine/traverse-common-functions'

export let trancheValue = barèmeType => (assiette, multiplicateur) =>
	barèmeType === 'marginal'
		? ({ de: min, à: max, taux }) =>
				val(assiette) < min * val(multiplicateur)
					? 0
					: (Math.min(val(assiette), max * val(multiplicateur)) -
							min * val(multiplicateur)) *
					  val(taux)
		: ({ de: min, à: max, taux, montant }) =>
				Math.round(val(assiette)) >= min &&
				(!max || Math.round(val(assiette)) <= max)
					? taux != null
						? val(assiette) * val(taux)
						: montant
					: 0
