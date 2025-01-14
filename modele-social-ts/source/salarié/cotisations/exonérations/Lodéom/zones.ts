import {
	Départements,
	entrepriseDansUnDesDépartements,
} from '../../../../territoire/département'
import { SituationSalarié } from '../../../situation'

/**
 * Zone géographique 1 (Guadeloupe, Martinique, La Réunion, Guyane)
 *
 * @param situation
 */
export const estZone1 = (situation: SituationSalarié) =>
	entrepriseDansUnDesDépartements(situation, [
		Départements.Guadeloupe,
		Départements.Martinique,
	])
