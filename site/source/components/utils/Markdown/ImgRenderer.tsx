type Props = {
	src: string
	alt?: string
}

export default function ImgRenderer({ src, alt }: Props) {
	return <img src={src} alt={alt || ''} />
}
