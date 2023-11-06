// import * as THREE from "three";
// import SmoothScroll from "./smoothScroll";
import EffectCanvas from "./effectCanvas";
// import MeshItem from "./meshItems";

class GridAnimation {
  el!: HTMLElement;
  gridItems!: any;
  grid!: any;

  constructor(screen?: HTMLElement) {
    if (!screen) return;

    this.el = screen;
    this.grid = this.el.querySelector(".cards");
    this.gridItems = this.grid.querySelectorAll(".card");

    new EffectCanvas(this.el);
  }
}

// class EffectCanvas {
//   public container: any;
//   public content: any;
//   public images: any[];
//   public meshItems: { render: () => void }[];
//   public scene!: THREE.Scene;
//   public camera!: THREE.PerspectiveCamera;
//   public renderer!: THREE.WebGL1Renderer;

//   constructor(el: HTMLElement) {
//     this.container = el;
//     this.content = this.container.querySelector(".screen__content");
//     this.images = [...this.container.querySelectorAll("img")];
//     // Used to store all meshes we will be creating.
//     this.meshItems = [];
//     // initiates Three.js
//     this.setupCamera();
//     this.createMeshItems();
//     this.render();
//   }

//   // Getter function used to get screen dimensions used for the camera and mesh materials
//   get viewport() {
//     const width = this.content.offsetWidth;
//     const height = this.content.offsetHeight;
//     const aspectRatio = width / height;

//     return {
//       width,
//       height,
//       aspectRatio,
//     };
//   }

//   setupCamera() {
//     // window.addEventListener("resize", this.onWindowResize.bind(this), false);

//     // Create new scene
//     this.scene = new THREE.Scene();

//     // Initialize perspective camera
//     const perspective = 1000;

//     // see fov image for a picture breakdown of this fov setting.
//     // prettier-ignore
//     const fov = (180 * (2 * Math.atan(this.viewport.height / 2 / perspective))) / Math.PI;
//     // prettier-ignore
//     this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);

//     // set the camera position on the z axis
//     this.camera.position.set(0, 0, perspective);

//     // Three.js renderer
//     this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
//     // uses the getter viewport function above to set size of canvas / renderer
//     this.renderer.setSize(this.viewport.width, this.viewport.height);
//     // Import to ensure image textures do not appear blurred.
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     // append the canvas to the body
//     document.body.appendChild(this.renderer.domElement);
//     // add left/right classes
//     this.renderer.domElement.classList.add(
//       this.container.classList.contains("screen__left")
//         ? "screen__left--canvas"
//         : "screen__right--canvas"
//     );
//   }

//   // onWindowResize() {
//   //   console.log("resizing");
//   //   // readjust the aspect ratio.
//   //   this.camera.aspect = this.viewport.aspectRatio;
//   //   // Used to recalulate projectin dimensions.
//   //   this.camera.updateProjectionMatrix();
//   //   // Update renderer
//   //   this.renderer.setSize(this.viewport.width, this.viewport.height);
//   // }

//   createMeshItems() {
//     // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
//     this.images.forEach((image) => {
//       const meshItem = new MeshItem(image, this.scene, this.container);
//       this.meshItems.push(meshItem);
//     });
//   }

//   // Animate the meshes. Repeatedly called using requestAnimationFrame
//   render() {
//     for (let i = 0; i < this.meshItems.length; i++) {
//       this.meshItems[i].render();
//     }
//     this.renderer.render(this.scene, this.camera);
//     requestAnimationFrame(this.render.bind(this));
//   }
// }

// class MeshItem {
//   container: any;
//   element: any;
//   scene: any;
//   offset: THREE.Vector2;
//   sizes: THREE.Vector2;
//   fragmentShader: string;
//   vertexShader: string;
//   smoothscroll: SmoothScroll;
//   geometry: THREE.PlaneGeometry;
//   imageTexture: THREE.Texture;
//   uniforms: {
//     uTexture: {
//       //texture data
//       value: any;
//     };
//     uOffset: {
//       //distortion strength
//       value: THREE.Vector2;
//     };
//     uAlpha: {
//       //opacity
//       value: number;
//     };
//   };
//   material: THREE.ShaderMaterial;
//   mesh: THREE.Mesh<any, any, THREE.Object3DEventMap>;
//   // Pass in the scene as we will be adding meshes to this scene.
//   constructor(element, scene, container) {
//     this.container = container;
//     this.element = element;
//     this.scene = scene;
//     this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
//     this.sizes = new THREE.Vector2(0, 0); //Size of mesh on screen. Will be updated below.

//     this.fragmentShader = ` uniform sampler2D uTexture;
//     uniform float uAlpha;
//     uniform vec2 uOffset;
//     varying vec2 vUv;

//     vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
//       float r = texture2D(textureImage,uv + offset).r;
//       vec2 gb = texture2D(textureImage,uv).gb;
//       return vec3(r,gb);
//     }

//     void main() {
//       vec3 color = rgbShift(uTexture,vUv,uOffset);
//       gl_FragColor = vec4(color,uAlpha);
//     }
//     `;
//     this.vertexShader = `uniform sampler2D uTexture;
//     uniform vec2 uOffset;
//     varying vec2 vUv;

//     #define M_PI 3.1415926535897932384626433832795

//     vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
//       position.x = position.x + (sin(uv.y * M_PI) * offset.x);
//       position.y = position.y + (sin(uv.x * M_PI) * offset.y);
//       return position;
//     }

//     void main() {
//       vUv = uv;
//       vec3 newPosition = deformationCurve(position, uv, uOffset);
//       gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
//     }
//     `;

//     this.createMesh();

//     // Initialize firstInstance to null
//     this.smoothscroll = container.classList.contains("screen__left")
//       ? SmoothScroll.instances[0]
//       : SmoothScroll.instances[1];

//     // Listen for scroll events
//     this.container.addEventListener("scroll", () => {
//       this.smoothscroll = container.classList.contains("screen__left")
//         ? SmoothScroll.instances[0]
//         : SmoothScroll.instances[1];
//     });
//   }

//   getDimensions() {
//     const { width, height, top, left } = this.element.getBoundingClientRect();
//     this.sizes.set(width, height);
//     this.offset.set(
//       left -
//         this.container.scrollWidth / 2 +
//         width / 2 -
//         this.container.offsetLeft,
//       -top + this.container.scrollHeight / 2 - height / 2
//     );
//   }

//   createMesh() {
//     this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
//     this.imageTexture = new THREE.TextureLoader().load(this.element.src);
//     this.uniforms = {
//       uTexture: {
//         //texture data
//         value: this.imageTexture,
//       },
//       uOffset: {
//         //distortion strength
//         value: new THREE.Vector2(0.0, 0.0),
//       },
//       uAlpha: {
//         //opacity
//         value: 1,
//       },
//     };
//     this.material = new THREE.ShaderMaterial({
//       uniforms: this.uniforms,
//       vertexShader: this.vertexShader,
//       fragmentShader: this.fragmentShader,
//       transparent: true,
//       // wireframe: true,
//       side: THREE.DoubleSide,
//     });
//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//     this.getDimensions(); // set offsetand sizes for placement on the scene
//     this.mesh.position.set(this.offset.x, this.offset.y, 0);
//     this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

//     this.scene.add(this.mesh);
//   }

//   render() {
//     // this function is repeatidly called for each instance in the aboce
//     this.getDimensions();
//     this.mesh.position.set(this.offset.x, this.offset.y, 0);
//     this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
//     this.uniforms.uOffset.value.set(
//       this.offset.x * 0.0,
//       -(
//         this.smoothscroll.lenis.targetScroll -
//         this.smoothscroll.lenis.actualScroll
//       ) * 0.0005
//     );
//   }
// }

export default GridAnimation;
