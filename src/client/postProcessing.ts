import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js'
import { ClearPass } from 'three/addons/postprocessing/ClearPass.js'

import {
	MaskPass,
	ClearMaskPass,
} from 'three/addons/postprocessing/MaskPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import {
	PerspectiveCamera,
	Scene,
	VideoTexture,
	WebGLRenderTarget,
	WebGLRenderer,
} from 'three'

export const postProcessing = (
	scene1: Scene,
	camera: PerspectiveCamera,
	renderer: WebGLRenderer
): EffectComposer => {
	const video = document.querySelector('.videoElement') as HTMLVideoElement
	const texture = new VideoTexture(video)
	const texturePass = new TexturePass(texture)
	const outputPass = new OutputPass()
	const parameters = {
		stencilBuffer: true,
	}
	const renderTarget = new WebGLRenderTarget(
		window.innerWidth,
		window.innerHeight,
		parameters
	)
	const clearPass = new ClearPass()
	const clearMaskPass = new ClearMaskPass()
	const maskPass1 = new MaskPass(scene1, camera)
	const composer = new EffectComposer(renderer, renderTarget)
	composer.addPass(clearPass)
	composer.addPass(maskPass1)
	composer.addPass(texturePass)
	composer.addPass(clearMaskPass)
	composer.addPass(outputPass)
	return composer
	//
}
