// units from site/source/locales/units.yaml:
const units = Object.entries({
	heure_plural: 'heures',
	jour_plural: 'jours',
	'jour ouvré_plural': 'jours ouvrés',
	semaine_plural: 'semaine',
	trimestre_plural: 'trimestres',
	'trimestre validé_plural': 'trimestres validés',
	an_plural: 'ans',
	employé_plural: 'employés',
	point_plural: 'points',
	mois_plural: 'mois',
	manifestation_plural: 'manifestations',
	'titre-restaurant_plural': 'titres-restaurant',
	part_plural: 'parts',
	enfant_plural: 'enfants',
})

export const getUnitKey = (unit: string): string => {
	const key = units
		.find(([, trans]) => trans === unit)?.[0]
		.replace(/_plural$/, '')

	return key || unit
}
