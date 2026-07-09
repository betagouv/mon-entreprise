import { ComponentType } from 'react'

import {
	AvailableLang,
	estLangueSupportée,
	SUPPORTED_LANGUAGES,
} from '@/locales/langue'

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
		metaTitle?: string
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
		const component = getDefaultComponent(module)
		const metadata = getMetadata(module)

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
	indexMetadata?: MDXModule['metadata']
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
	langue: AvailableLang = 'fr'
): MDXDocumentationResult {
	const modulesParSlug = sélectionnerModulesParLangue(globModules, langue)

	const processedModules: Record<string, MDXModule | ComponentType> = {}
	let indexComponent: ComponentType | undefined
	let indexMetadata: MDXModule['metadata']

	Object.entries(modulesParSlug).forEach(([slug, module]) => {
		if (slug === 'index') {
			indexComponent = getDefaultComponent(module)
			indexMetadata = getMetadata(module)
		} else {
			processedModules[slug] = module
		}
	})

	return {
		documentations: createMDXDocumentation(processedModules),
		indexComponent,
		indexMetadata,
	}
}

type ModuleMDX = MDXModule | ComponentType

/**
 * Sélectionne, pour chaque document, la variante de la langue demandée.
 * Chaque document doit exister dans chaque langue supportée
 * (`slug.fr.mdx`, `slug.en.mdx`, …) ; un fichier sans suffixe de langue
 * est une erreur.
 */
function sélectionnerModulesParLangue(
	globModules: Record<string, unknown>,
	langue: AvailableLang
): Record<string, ModuleMDX> {
	const variantesParSlug: Record<
		string,
		Partial<Record<AvailableLang, ModuleMDX>>
	> = {}

	Object.entries(globModules).forEach(([path, module]) => {
		const { slug, langue: langueDuFichier } = extraireSlugEtLangue(path)
		if (langueDuFichier === null) {
			throw new Error(
				`Documentation « ${slug} » : fichier sans suffixe de langue reconnu — fournir une variante par langue supportée (${slug}.fr.mdx, ${slug}.en.mdx, …).`
			)
		}
		variantesParSlug[slug] ??= {}
		variantesParSlug[slug][langueDuFichier] = module as ModuleMDX
	})

	const modules: Record<string, ModuleMDX> = {}
	Object.entries(variantesParSlug).forEach(([slug, variantes]) => {
		modules[slug] = valideVariantesComplètes(slug, variantes)[langue]
	})

	return modules
}

function valideVariantesComplètes(
	slug: string,
	variantes: Partial<Record<AvailableLang, ModuleMDX>>
): Record<AvailableLang, ModuleMDX> {
	const manquantes = SUPPORTED_LANGUAGES.filter((langue) => !variantes[langue])
	if (manquantes.length > 0) {
		throw new Error(
			`Documentation « ${slug} » : variante(s) de langue manquante(s) : ${manquantes.join(
				', '
			)}.`
		)
	}

	return variantes as Record<AvailableLang, ModuleMDX>
}

function extraireSlugEtLangue(path: string): {
	slug: string
	langue: AvailableLang | null
} {
	const filename = extractBaseFilename(path)
	const dernierPoint = filename.lastIndexOf('.')

	if (dernierPoint !== -1) {
		const suffixe = filename.slice(dernierPoint + 1)
		if (estLangueSupportée(suffixe)) {
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

function getMetadata(module: MDXModule | ComponentType): MDXModule['metadata'] {
	return typeof module === 'object' && 'metadata' in module
		? module.metadata
		: undefined
}

function extractBaseFilename(filePath: string): string {
	const filename = filePath.split('/').pop() ?? ''

	return filename.substring(0, filename.lastIndexOf('.')) || filename
}
