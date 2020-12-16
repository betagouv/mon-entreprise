import { createContext } from 'react'
import { SitePathsType } from 'site/sitePaths'

export const SitePathsContext = createContext<SitePathsType>(
	{} as SitePathsType
)

export const SitePathProvider = SitePathsContext.Provider

export type SitePaths = SitePathsType
