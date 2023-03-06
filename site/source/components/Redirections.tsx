import { useMemo } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { useSitePaths } from '@/sitePaths'

interface Props {
	children: React.ReactNode
}

export default function Redirections({ children }: Props) {
	const { absoluteSitePaths } = useSitePaths()
	const { pathname } = useLocation()

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
				to: decodeURI(pathname).replace(
					/^\/(gérer|manage)/,
					absoluteSitePaths.assistants.index
				),
			},
			{
				paths: ['/créer/*', '/create/*'],
				to: decodeURI(pathname).replace(
					/^\/(créer|create)/,
					absoluteSitePaths.assistants['choix-du-statut'].index
				),
			},
			{
				paths: [
					'/simulateurs/économie-collaborative/*',
					'/calculators/sharing-economy/*',
				],
				to: decodeURI(pathname).replace(
					/^\/(simulateurs|calculators)/,
					absoluteSitePaths.assistants.index
				),
			},
		] satisfies { paths: string[]; to: string }[]
	}, [
		absoluteSitePaths.assistants,
		absoluteSitePaths.plan,
		absoluteSitePaths.stats,
		pathname,
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
