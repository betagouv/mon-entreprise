import { every } from 'effect/Predicate'

import {
	aChiffreDAffairesAnnuelInférieurÀ,
	ChiffreDAffairesAnnuel,
} from '../../../../entreprise/ChiffreDAffaires'
import {
	Effectif,
	entrepriseAEffectifInférieurÀ,
} from '../../../../entreprise/Effectif'
import { SituationEntreprise } from '../../../../entreprise/SituationEntreprise'
import { Barème } from './'
import { estZone1 } from './zones'

/**
 *  Barème innovation et croissance
 *
 *  Sont éligibles à ce barème les employeurs occupant moins de 250 salariés et ayant réalisé un chiffre d’affaires annuel inférieur à 50 millions d’euros, au titre de la rémunération des salariés concourant essentiellement à la réalisation de projets innovants dans le domaine des technologies de l’information et de la communication.
 *
 *  Les projets innovants se définissent comme des projets ayant pour but l’introduction d’un bien, d’un service, d’une méthode de production ou de distribution nouveau ou sensiblement amélioré sur le plan des caractéristiques et de l’usage auquel il est destiné. Ces projets doivent être réalisés dans les domaines suivants
 *    – télécommunication ;
 *    – informatique, dont notamment programmation, conseil en systèmes et logiciels, tierce maintenance de systèmes et d’applications, gestion d‘installations, traitement des données, hébergement et activités connexes ;
 *    – édition de portails internet et de logiciels;
 *    – infographie, notamment conception de contenus visuels et numériques ;
 *    – conception d’objets connectés.
 *    – Si ces conditions sont réunies, l’exonération s’applique aux rémunérations versées aux salariés occupés principalement à la réalisation de projets innovants.
 *    – Sont donc exclues les fonctions supports : tâches administratives financières, logistiques et de ressources humaines.
 *
 *  @see Fiche Urssaf : https://www.urssaf.fr/portail/home/outre-mer/employeur/exoneration-de-cotisations-di-1/employeurs-situes-en-guadeloupe/bareme-dit-innovation-et-croissa.html
 */
export const BarèmeInnovationEtCroissance = {
	nom: 'Innovation et croissance',
	estÉligible: every([
		estZone1,
		entrepriseAEffectifInférieurÀ(Effectif(250)),
		aChiffreDAffairesAnnuelInférieurÀ(ChiffreDAffairesAnnuel(50_000_000)),
		(situation) =>
			aUneActivitéÉligibleInnovationEtCroissance(situation.entreprise),
	]),
} as const satisfies Barème

const aUneActivitéÉligibleInnovationEtCroissance = (
	entreprise: SituationEntreprise
) => entreprise.activité.éligibleLodeomÉligibleInnovationEtCroissance || false
