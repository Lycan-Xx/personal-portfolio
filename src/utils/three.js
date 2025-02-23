/**
 * Clean up a scene's materials and geometry
 */
export const cleanScene = scene => {
  if (!scene) return;

  scene.traverse(object => {
    if (!object.isMesh) return;

    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        for (const material of object.material) {
          cleanMaterial(material);
        }
      }
    }
  });
};

/**
 * Clean up and dispose of a material
 */
export const cleanMaterial = material => {
  if (!material) return;

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
export const cleanRenderer = renderer => {
  if (!renderer) return;

  renderer.dispose();
  renderer.forceContextLoss();
};

/**
 * Clean up lights by removing them from their parent
 */
export const removeLights = lights => {
  if (!lights) return;

  for (const light of lights) {
    if (light && light.parent) {
      light.parent.remove(light);
    }
    if (light && light.dispose) {
      light.dispose();
    }
  }
};

/**
 * A reasonable default pixel ratio
 */
export const renderPixelRatio = Math.min(2, window.devicePixelRatio);