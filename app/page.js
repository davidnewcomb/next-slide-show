
import Slideshow from './Slideshow'
import { SERVER_IMAGE_DIR } from './cfg'
import { getImages } from './server'


export default async function HomePage() {

	const images = await getImages(SERVER_IMAGE_DIR)

	return (
		<Slideshow images={images} />
	)
}
