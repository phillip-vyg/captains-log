import * as THREE from "three";
import SmoothScroll from "./smoothScroll";

class MeshItem {
  container: any;
  element: any;
  scene: any;
  offset: THREE.Vector2;
  sizes: THREE.Vector2;
  fragmentShader: string;
  vertexShader: string;
  smoothscroll: SmoothScroll;
  geometry: THREE.PlaneGeometry;
  imageTexture: THREE.Texture;
  uniforms: {
    uTexture: {
      //texture data
      value: any;
    };
    uOffset: {
      //distortion strength
      value: THREE.Vector2;
    };
    uAlpha: {
      //opacity
      value: number;
    };
  };
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh<any, any, THREE.Object3DEventMap>;
  // Pass in the scene as we will be adding meshes to this scene.
  constructor(
    element: any,
    scene: THREE.Scene,
    container: { classList: { contains: (arg0: string) => any } }
  ) {
    this.container = container;
    this.element = element;
    this.scene = scene;
    this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
    this.sizes = new THREE.Vector2(0, 0); //Size of mesh on screen. Will be updated below.

    this.fragmentShader = ` uniform sampler2D uTexture;
    uniform float uAlpha;
    uniform vec2 uOffset;
    varying vec2 vUv;

    vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
      float r = texture2D(textureImage,uv + offset).r;
      vec2 gb = texture2D(textureImage,uv).gb;
      return vec3(r,gb);
    }

    void main() {
      vec3 color = rgbShift(uTexture,vUv,uOffset);
      gl_FragColor = vec4(color,uAlpha);
    }
    `;
    this.vertexShader = `uniform sampler2D uTexture;
    uniform vec2 uOffset;
    varying vec2 vUv;

    #define M_PI 3.1415926535897932384626433832795

    vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
      position.x = position.x + (sin(uv.y * M_PI) * offset.x);
      position.y = position.y + (sin(uv.x * M_PI) * offset.y);
      return position;
    }

    void main() {
      vUv = uv;
      vec3 newPosition = deformationCurve(position, uv, uOffset);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }
    `;

    this.createMesh();

    // Initialize firstInstance to null
    this.smoothscroll = container.classList.contains("screen__left")
      ? SmoothScroll.instances[0]
      : SmoothScroll.instances[1];

    // Listen for scroll events
    this.container.addEventListener("scroll", () => {
      this.smoothscroll = container.classList.contains("screen__left")
        ? SmoothScroll.instances[0]
        : SmoothScroll.instances[1];
    });
  }

  getDimensions() {
    const { width, height, top, left } = this.element.getBoundingClientRect();
    this.sizes.set(width, height);
    this.offset.set(
      left -
        this.container.scrollWidth / 2 +
        width / 2 -
        this.container.offsetLeft,
      -top + this.container.scrollHeight / 2 - height / 2
    );
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.imageTexture = new THREE.TextureLoader().load(this.element.src);
    this.uniforms = {
      uTexture: {
        //texture data
        value: this.imageTexture,
      },
      uOffset: {
        //distortion strength
        value: new THREE.Vector2(0.0, 0.0),
      },
      uAlpha: {
        //opacity
        value: 1,
      },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,
      // wireframe: true,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.getDimensions(); // set offsetand sizes for placement on the scene
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    this.scene.add(this.mesh);
  }

  render() {
    // this function is repeatidly called for each instance in the aboce
    this.getDimensions();
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    this.uniforms.uOffset.value.set(
      this.offset.x * 0.0,
      -(
        this.smoothscroll.lenis.targetScroll -
        this.smoothscroll.lenis.actualScroll
      ) * 0.0005
    );
  }
}

export default MeshItem;
