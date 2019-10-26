import React, { createContext } from 'react'
import { SitePathsType } from 'sites/mon-entreprise.fr/sitePaths'

export const SitePathsContext = createContext<Partial<SitePathsType>>({})

export const SitePathProvider = SitePathsContext.Provider

export interface WithSitePathsProps {
	sitePaths: SitePathsType
}

export default function withSitePaths<P extends object>(
	WrappedComponent: React.ComponentType<P>
) {
	class WithSitePaths extends React.Component<P & WithSitePathsProps> {
		displayName = `withSitePaths(${WrappedComponent.displayName || ''})`
		render() {
			return (
				<SitePathsContext.Consumer>
					{sitePaths => (
						<WrappedComponent {...(this.props as P)} sitePaths={sitePaths} />
					)}
				</SitePathsContext.Consumer>
			)
		}
	}
	return WithSitePaths
}

export type SitePaths = SitePathsType
