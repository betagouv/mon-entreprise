import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { LiensUtiles } from '../References/LiensUtiles'
import { useRéférencesÀAfficher } from '../References/useReferencesAAfficher'

type Props = {
	engine: Engine<DottedName>
	dottedName: DottedName
}

export const RéférencesDeRègle = ({ engine, dottedName }: Props) => {
	const { références } = engine.getRule(dottedName).rawNode
	const référencesÀAfficher = useRéférencesÀAfficher(références)

	return <LiensUtiles références={référencesÀAfficher} />
}
