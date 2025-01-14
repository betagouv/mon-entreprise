import { and } from 'effect/Predicate'

import {
	aChiffreDAffairesAnnuelInférieurÀ,
	ChiffreDAffairesAnnuel,
} from '../../../../entreprise/ChiffreDAffaires'
import {
	Effectif,
	entrepriseAEffectifInférieurÀ,
} from '../../../../entreprise/Effectif'
import { Barème } from './index'

/**
 * Barème compétitivité renforcée
 *
 * - Chiffre d'affaires de moins de 50 millions d'euros
 * - Les employeurs relevant des secteurs de l’industrie, de la restauration, de l’environnement, de l’agro nutrition, des énergies renouvelables, des nouvelles technologies de l’information et de la communication et des centres d’appel, de la pêche, des cultures marines, de l’aquaculture, de l’agriculture, du tourisme y compris les activités de loisirs s’y rapportant, du nautisme, de l’hôtellerie, de la recherche et du développement ;
 * - Les entreprises bénéficiaires du régime de perfectionnement actif défini à l’article 256 du règlement (UE) n° 952/2013 du parlement européen et du conseil du 9 octobre 2013 établissant le code des douanes de l’Union
 * - En Guyane, les employeurs ayant une activité principale relevant de l’un des secteurs d’activité éligibles à la réduction d’impôt prévue à l’article 199 undecies B du code général des impôts, ou correspondant à l’une des activités suivantes : comptabilité, conseil aux entreprises, ingénierie ou études techniques.
 *
 * @see Fiche Urssaf: https://www.urssaf.fr/portail/home/outre-mer/employeur/exoneration-de-cotisations-di-1/employeurs-situes-en-guadeloupe/bareme-dit-de-competitivite-renf.html
 */
export const BarèmeCompétitivitéRenforcée = {
	nom: 'Compétivité renforcée',
	estÉligible: and(
		entrepriseAEffectifInférieurÀ(Effectif(250)),
		aChiffreDAffairesAnnuelInférieurÀ(ChiffreDAffairesAnnuel(50_000_000))
	),
} as const satisfies Barème
