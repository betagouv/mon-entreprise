import { ComponentType } from 'react'

export interface MDXDocumentation {
	path: string
	slug: string
	title: string
	description?: string
	component: ComponentType
}

export interface MDXModule {
	default: ComponentType
	metadata?: {
		title: string
		description?: string
	}
}

/**
 * Crée automatiquement les métadonnées de documentation à partir des modules MDX importés
 *
 * @param mdxModules - Un objet avec les imports de modules MDX
 * @returns Un tableau de métadonnées de documentation prêtes pour le routage
 *
 * @example
 * ```typescript
 * import AbattementMDX from './abattement-forfaitaire.mdx'
 * import MicroBicMDX from './micro-bic.mdx'
 *
 * const docs = createMDXDocumentation({
 *   'abattement-forfaitaire': AbattementMDX,
 *   'micro-bic': MicroBicMDX,
 * })
 * ```
 */
function createMDXDocumentation(
	mdxModules: Record<string, MDXModule | ComponentType>
): MDXDocumentation[] {
	return Object.entries(mdxModules).map(([slug, module]) => {
		const isFullModule = typeof module === 'object' && 'default' in module
		const component = isFullModule ? module.default : module
		const metadata = isFullModule ? module.metadata : undefined

		const title = metadata?.title ?? slugToTitle(slug)
		const description = metadata?.description

		return {
			path: slug,
			slug,
			title,
			description,
			component,
		}
	})
}

export interface MDXDocumentationResult {
	documentations: MDXDocumentation[]
	indexComponent?: ComponentType
}

/**
 * Crée automatiquement la documentation à partir de tous les fichiers .mdx
 * d'un dossier en utilisant Vite glob imports
 *
 * @param globModules - Le résultat de import.meta.glob('*.mdx', { eager: true })
 * @returns Un objet contenant les documentations et un composant index
 *
 * @example
 * ```typescript
 * const modules = import.meta.glob('./*.mdx', { eager: true })
 * const { documentations, indexComponent } = createMDXDocumentationFromGlob(modules)
 * ```
 */
export function createMDXDocumentationFromGlob(
	globModules: Record<string, unknown>
): MDXDocumentationResult {
	const processedModules: Record<string, MDXModule | ComponentType> = {}
	let indexComponent: ComponentType | undefined

	Object.entries(globModules).forEach(([path, module]) => {
		const filename = extractBaseFilename(path)

		if (filename === 'index') {
			const indexModule = module as MDXModule | ComponentType
			indexComponent = getDefaultComponent(indexModule)
		} else {
			processedModules[filename] = module as MDXModule | ComponentType
		}
	})

	return {
		documentations: createMDXDocumentation(processedModules),
		indexComponent,
	}
}

/**
 * @example slugToTitle('micro-bic') => 'Micro Bic'
 */
function slugToTitle(slug: string): string {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

function getDefaultComponent<T>(
	module: MDXModule | ComponentType<T>
): ComponentType<T> {
	const isModuleWithDefault = typeof module === 'object' && 'default' in module

	return isModuleWithDefault ? (module.default as ComponentType<T>) : module
}

function extractBaseFilename(filePath: string): string {
	const filename = filePath.split('/').pop() ?? ''

	return filename.substring(0, filename.lastIndexOf('.')) || filename
}
