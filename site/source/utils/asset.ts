type ImportedAsset = string | { src: string }

export const urlAsset = (asset: ImportedAsset): string =>
	typeof asset === 'string' ? asset : asset.src
