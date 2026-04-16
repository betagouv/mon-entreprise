export { useNavigation } from './useNavigation'
export { ReactRouterNavigationProvider } from './providers/ReactRouterNavigationProvider'
export { MockNavigationProvider } from './providers/MockNavigationProvider'
export type { LinkProps, NavigationAPI, NavigationType } from './NavigationAPI'
export { Link } from './Link'
// NavLink est spécifique à react-router (active state styling).
// À abstraire quand les composants concernés migreront vers Next.js.
export { NavLink } from 'react-router-dom'
