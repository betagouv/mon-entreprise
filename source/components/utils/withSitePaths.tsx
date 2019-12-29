import { createContext } from 'react'
import { SitePathsType } from 'sites/mon-entreprise.fr/sitePaths'

export const SitePathsContext = createContext<SitePathsType>(
	{} as SitePathsType
)

export const SitePathProvider = SitePathsContext.Provider

export type SitePaths = SitePathsType
