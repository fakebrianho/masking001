import {
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	ShaderMaterial,
	Vector2,
	Vector4,
	DoubleSide,
	TorusKnotGeometry,
} from 'three'
import vertexShader from '/@/shaders/vertex.glsl'
import fragmentShader from '/@/shaders/fragment.glsl'
export const addMeshes = (): Mesh => {
	// const geometry = new BoxGeometry(1, 1, 1)
	const geometry = new TorusKnotGeometry(10, 2, 200, 20, 2, 3)
	const material = new MeshStandardMaterial({ color: 0xff0000 })
	const mesh = new Mesh(geometry, material)
	mesh.position.set(0, 0, -50)
	return mesh
}

export const addShader = (): Mesh => {
	const geometry = new BoxGeometry(1, 1, 1)
	const material = new ShaderMaterial({
		extensions: {
			derivatives: true,
		},
		side: DoubleSide,
		uniforms: {
			uTime: { value: 0 },
			resolution: { value: new Vector4() },
			uvRate1: {
				value: new Vector2(1, 1),
			},
			displacementStrength: { value: 0.5 },
		},
		wireframe: true,
		transparent: true,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	})
	const mesh = new Mesh(geometry, material)
	mesh.position.set(2, 0, 0)
	return mesh
}
