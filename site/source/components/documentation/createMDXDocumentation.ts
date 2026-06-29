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
	globModules: Record<string, unknown>,
	langue = 'fr'
): MDXDocumentationResult {
	const modulesParSlug = sélectionnerModulesParLangue(globModules, langue)

	const processedModules: Record<string, MDXModule | ComponentType> = {}
	let indexComponent: ComponentType | undefined

	Object.entries(modulesParSlug).forEach(([slug, module]) => {
		if (slug === 'index') {
			indexComponent = getDefaultComponent(module)
		} else {
			processedModules[slug] = module
		}
	})

	return {
		documentations: createMDXDocumentation(processedModules),
		indexComponent,
	}
}

const LANGUES_SUPPORTÉES = ['fr', 'en']

/**
 * Sélectionne, pour chaque document, la variante de langue demandée :
 * `slug.<langue>.mdx`, à défaut `slug.fr.mdx`, à défaut `slug.mdx` (sans suffixe).
 */
function sélectionnerModulesParLangue(
	globModules: Record<string, unknown>,
	langue: string
): Record<string, MDXModule | ComponentType> {
	const variantesParSlug: Record<
		string,
		Record<string, MDXModule | ComponentType>
	> = {}

	Object.entries(globModules).forEach(([path, module]) => {
		const { slug, langue: langueDuFichier } = extraireSlugEtLangue(path)
		variantesParSlug[slug] ??= {}
		variantesParSlug[slug][langueDuFichier ?? 'défaut'] = module as
			| MDXModule
			| ComponentType
	})

	const modules: Record<string, MDXModule | ComponentType> = {}
	Object.entries(variantesParSlug).forEach(([slug, variantes]) => {
		modules[slug] = variantes[langue] ?? variantes.fr ?? variantes.défaut
	})

	return modules
}

function extraireSlugEtLangue(path: string): {
	slug: string
	langue: string | null
} {
	const filename = extractBaseFilename(path)
	const dernierPoint = filename.lastIndexOf('.')

	if (dernierPoint !== -1) {
		const suffixe = filename.slice(dernierPoint + 1)
		if (LANGUES_SUPPORTÉES.includes(suffixe)) {
			return { slug: filename.slice(0, dernierPoint), langue: suffixe }
		}
	}

	return { slug: filename, langue: null }
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
