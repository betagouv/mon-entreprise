import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function MecanismRésoudreRéférenceCirculaire({ explanation }) {
	return (
		<Mecanism
			name="résoudre la référence circulaire"
			value={explanation.valeur}
		>
			<p>
				{' '}
				Cette valeur a été retrouvé en résolvant la référence circulaire dans la
				formule ci dessous :{' '}
			</p>

			<Explanation node={explanation.valeur} />
		</Mecanism>
	)
}
