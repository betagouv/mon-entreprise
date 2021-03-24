import Explanation from '../Explanation'
import { Mecanism } from './common'

export default function MecanismRésoudreCycle({ explanation }) {
	return (
		<Mecanism name="résoudre le cycle" value={explanation.valeur}>
			<p>
				{' '}
				Cette valeur a été retrouvé en résolvant le cycle dans la formule ci
				dessous :{' '}
			</p>

			<Explanation node={explanation.valeur} />
		</Mecanism>
	)
}
