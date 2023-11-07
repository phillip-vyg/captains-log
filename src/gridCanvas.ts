import * as THREE from "three";
import MeshItem from "./meshItem";
import gsap from "gsap";
import { SCREENS } from "./globals";

class GridCanvas {
  container: any;
  content: any;
  images: any[];
  meshItems: { render: () => void }[];
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGL1Renderer;
  timeout: number;

  private _viewport = {
    width: 0,
    height: 0,
    aspectRatio: 0,
  };

  // Getter function used to get screen dimensions used for the camera and mesh materials
  get viewport() {
    return this._viewport;
  }

  // Setter function for viewport
  set viewport({
    width,
    height,
    aspectRatio,
  }: {
    width: number;
    height: number;
    aspectRatio: number;
  }) {
    this._viewport = {
      width,
      height,
      aspectRatio,
    };
  }

  constructor(el: HTMLElement) {
    this.container = el;
    this.content = this.container.querySelector(".screen__content");
    this.images = [...this.container.querySelectorAll("img")];
    // Used to store all meshes we will be creating.
    this.meshItems = [];

    this.draw();
  }

  setupCamera() {
    window.addEventListener("resize", this.resize.bind(this), false);

    // Create new scene
    this.scene = new THREE.Scene();

    // Initialize perspective camera
    const perspective = 1000;

    // see fov image for a picture breakdown of this fov setting.
    // prettier-ignore
    const fov = (180 * (2 * Math.atan(this.viewport.height / 2 / perspective))) / Math.PI;
    // prettier-ignore
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);

    // set the camera position on the z axis
    this.camera.position.set(0, 0, perspective);

    // Three.js renderer
    this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
    // uses the getter viewport function above to set size of canvas / renderer
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // Import to ensure image textures do not appear blurred.
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // append the canvas to the body
    document.body.appendChild(this.renderer.domElement);
    // add left/right classes
    this.renderer.domElement.classList.add(
      this.container.classList.contains("screen__left")
        ? "screen__left--canvas"
        : "screen__right--canvas"
    );
  }

  resize() {
    document.querySelectorAll("canvas").forEach((el) => el.remove());
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.draw();
      gsap.set(SCREENS, { clearProps: "transform" });
    }, 100);
  }

  draw() {
    this.viewport.width = this.content.offsetWidth;
    this.viewport.height = this.content.offsetHeight;
    this.viewport.aspectRatio = this.viewport.width / this.viewport.height;

    this.setupCamera();
    this.createMeshItems();
    this.render();
  }

  createMeshItems() {
    // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
    this.images.forEach((image) => {
      const meshItem = new MeshItem(image, this.scene, this.container);
      this.meshItems.push(meshItem);
    });
  }

  // Animate the meshes. Repeatedly called using requestAnimationFrame
  render() {
    for (let i = 0; i < this.meshItems.length; i++) this.meshItems[i].render();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default GridCanvas;
