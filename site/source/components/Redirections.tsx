import { useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

interface Props {
	children: React.ReactNode
}

export default function Redirections({ children }: Props) {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()

	const redirections = useMemo(() => {
		return [
			{
				paths: ['/stats'],
				to: absoluteSitePaths.stats,
			},
			{
				paths: ['/plan-de-site', '/site-map'],
				to: absoluteSitePaths.plan,
			},
			{
				paths: [
					'/gérer/aide-declaration-independants/beta',
					'/manage/declaration-aid-independent/beta',
				],
				to: absoluteSitePaths.assistants.déclarationIndépendant.index,
			},
			{
				paths: [
					'/gérer/aide-declaration-independants',
					'/manage/declaration-aid-independent',
				],
				to: absoluteSitePaths.assistants[
					'déclaration-charges-sociales-indépendant'
				],
			},
			{
				paths: ['/gérer/*', '/manage/*'],
				to: decodeURI(currentPath).replace(
					/^\/(gérer|manage)/,
					absoluteSitePaths.assistants.index
				),
			},
			{
				paths: ['/créer/*', '/create/*'],
				to: decodeURI(currentPath).replace(
					/^\/(créer|create)/,
					absoluteSitePaths.assistants['choix-du-statut'].index
				),
			},
			{
				paths: [
					'/simulateurs/économie-collaborative/*',
					'/calculators/sharing-economy/*',
				],
				to: decodeURI(currentPath).replace(
					/^\/(simulateurs|calculators)/,
					absoluteSitePaths.assistants.index
				),
			},
			{ paths: ['/assistants/embaucher', '/assistants/hiring'], to: '/404' },
		] satisfies { paths: string[]; to: string }[]
	}, [
		absoluteSitePaths.assistants,
		absoluteSitePaths.plan,
		absoluteSitePaths.stats,
		currentPath,
	])

	return (
		<Routes>
			{redirections.flatMap(({ paths, to }) =>
				paths.map((path) => (
					<Route
						key={path}
						path={path}
						element={<Navigate to={to} replace />}
					/>
				))
			)}
			<Route path="*" element={children} />
		</Routes>
	)
}
