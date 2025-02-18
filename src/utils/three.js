/**
 * Clean up a scene's materials and geometry
 */
export const cleanScene = (scene) => {
	if (!scene) return;

	scene.traverse(object => {
		if (object.isMesh) {
			if (object.geometry) {
				object.geometry.dispose();
			}
			if (object.material) {
				if (object.material.map) object.material.map.dispose();
				object.material.dispose();
			}
		}
	});
	scene.clear();
};

/**
 * Clean up and dispose of a material
 */
export const cleanMaterial = material => {
	material.dispose();

	for (const key of Object.keys(material)) {
		const value = material[key];
		if (value && typeof value === 'object' && 'minFilter' in value) {
			value.dispose();
		}
	}
};

/**
 * Clean up and dispose of a renderer
 */
export const cleanRenderer = (renderer) => {
	renderer.dispose();
	renderer.forceContextLoss();
	renderer.domElement = null;
};

/**
 * Clean up lights by removing them from their parent
 */
export const removeLights = lights => {
	for (const light of lights) {
		if (light.parent) {
			light.parent.remove(light);
		}
	}
};

/**
 * A reasonable default pixel ratio
 */
export const renderPixelRatio = 2;
