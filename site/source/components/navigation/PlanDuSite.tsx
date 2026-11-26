import type { ComponentProps } from 'react'

import { Ul } from '@/design-system'
import { environnement } from '@/services/environnement'
import { routeHrefs } from '@/services/routing'

import { PlanDepuisSitePaths } from './PlanDepuisSitePaths'
import { PlanDesRoutes } from './PlanDesRoutes'

export const PlanDuSite = ({
	className,
	size,
}: {
	className?: string
	size?: ComponentProps<typeof Ul>['size']
}) => (
	<Ul className={className} size={size} $noMarker>
		{environnement.sousVite ? (
			<PlanDepuisSitePaths />
		) : (
			<PlanDesRoutes routeHrefs={routeHrefs} />
		)}
	</Ul>
)
