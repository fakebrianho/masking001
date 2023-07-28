import * as THREE from 'three'
import { sizes, camera } from './camera'
import addLight from './lights'
import { addMeshes } from './addMeshes'
import { postProcessing } from './postProcessing'
import { PARAMS } from './controls'
import { resize } from './eventListeners'
// import './style.css'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/all'
import { ScrollTrigger } from 'gsap/all'

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor(new THREE.Color(0xffffff))
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)
const meshes: { [key: string]: any } = {}
const lights: { [key: string]: any } = {}
gsap.registerPlugin(SplitText, ScrollTrigger)
let chars: any
let composer: EffectComposer
let scrollCounter: number = 0
let isScrolling: any
let lock: boolean = false
init()
function init(): void {
	renderer.setSize(sizes.width, sizes.height)
	document.body.appendChild(renderer.domElement)
	meshes.default = addMeshes()
	lights.default = addLight()
	scene.add(meshes.default)
	scene.add(lights.default)
	composer = postProcessing(scene, camera, renderer)
	resize(camera, renderer, sizes)
	split()
	animate()
}

function triggerFunction() {
	if (!lock) {
		scrollCounter++
		view(scrollCounter)
		lock = true
		if (scrollCounter === 3) {
			window.removeEventListener('wheel', handleFakeScroll)
		}
		fakeScrollPosition = 0
	}
}

function view(step: number) {
	if (step == 1) {
		gsap.to('.container', {
			opacity: 1,
			duration: 0.5,
		})
		gsap.from(chars, {
			yPercent: 130,
			stagger: 0.05,
			ease: 'back.out',
			duration: 1,
		})
	}
	if (step == 2) {
		// gsap.to(chars, { translateX: 400, stagger: 0.05, duration: 1 })
		// gsap.to(chars, { letterSpacing: 0, stagger: 0.05, duration: 1 })
		gsap.set(chars, { yPercent: -100 })
		gsap.from(chars, {
			yPercent: 0,
			stagger: 0.05,
			ease: 'back.out',
			duration: 1,
		})
	}
}

// Variable to track the fake scroll position
let fakeScrollPosition = 0

// Function to handle the fake scroll interaction
function handleFakeScroll(event: WheelEvent) {
	event.preventDefault() // Prevent the default scroll behavior
	const delta = event.deltaY // Get the scroll direction (deltaY)
	// Manually update the fake scroll position based on the scroll direction
	fakeScrollPosition += delta

	// Check if the scroll position is past the trigger point and trigger the function
	const triggerPoint = 200 // The point where the function should be triggered
	if (fakeScrollPosition >= triggerPoint) {
		triggerFunction()
		// Reset the fake scroll position after triggering the function
		fakeScrollPosition = 0
	}
	window.clearTimeout(isScrolling)

	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function () {
		// Run the callback
		lock = false
	}, 66)
}

// Attach the event listener to handle the fake scroll interaction
window.addEventListener('wheel', handleFakeScroll, { passive: false })

document.addEventListener(
	'DOMContentLoaded',
	function () {
		const main: HTMLDivElement | null = document.querySelector('.main')
		const loader: HTMLDivElement | null = document.querySelector('.loader')
		if (main) {
			main.style.visibility = 'visible'
		}
		if (loader) {
			loader.style.display = 'none'
		}
	},
	false
)
function split(): void {
	//
	let mySplitText = new SplitText('.split', { type: 'chars' })
	chars = mySplitText.chars

	// console.log(chars)
	// gsap.set(chars, { opacity: 0 })
}

function animate(): void {
	requestAnimationFrame(animate)
	meshes.default.scale.set(PARAMS.size.x, PARAMS.size.y, PARAMS.size.z)
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.y += 0.01
	composer.render()
}
