import NextLink from 'next/link'
import { useRouter } from 'next/router'

export function Link(props) {
	return (
		<NextLink href={props.to}>
			<>{props.children}</>
		</NextLink>
	)
}

export { Link as NavLink }
export function useLocation() {
	const router = useRouter()
	return router
}
export function useHistory() {
	const router = useRouter()
	return router
}

export function Switch() {
	return null
}

export function Route() {
	return null
}

export function Redirect() {
	return null
}
