import { useTranslation } from 'react-i18next'

import { Li, Link } from '@/design-system'
import { parseLangue } from '@/locales/langue'
import { declaredPaths, routeLabels, type RouteHrefs } from '@/services/routing'

export const PlanDesRoutes = ({ routeHrefs }: { routeHrefs: RouteHrefs }) => {
	const { i18n } = useTranslation()
	const libelléParChemin = routeLabels(parseLangue(i18n.language))

	return (
		<>
			{declaredPaths
				.filter((chemin) => chemin in routeHrefs)
				.map((chemin) => (
					<Li key={chemin}>
						<Link to={routeHrefs[chemin]}>{libelléParChemin[chemin]}</Link>
					</Li>
				))}
		</>
	)
}
