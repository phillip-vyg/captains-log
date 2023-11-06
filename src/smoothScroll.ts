import Lenis from "@studio-freight/lenis";

class SmoothScroll {
  public el!: HTMLElement;
  public content!: HTMLElement;
  public lenis!: Lenis;

  // Static property to store instances
  static instances: SmoothScroll[] = [];

  constructor(screen?: HTMLElement) {
    if (!screen) return;

    this.el = screen;
    this.content = this.el.querySelector(".screen__content") as HTMLElement;

    // Kicks off Lenis
    this.lenis = new Lenis({
      wrapper: this.el,
      content: this.content,
      lerp: 0.15, // Lower values create a smoother scroll effect
      smoothWheel: true, // Enables smooth scrolling for mouse wheel events
    });

    // Keeps Lenis ticking over
    requestAnimationFrame((t) => this.raf(t));

    this.events();

    // Allows us to retreive this in other classes
    SmoothScroll.instances.push(this);
  }

  // Lenis RAF utility
  raf(time: number) {
    this.lenis.raf(time);
    requestAnimationFrame((t) => this.raf(t));
  }

  events() {
    // scale down the container and stop scrolling when hover off the section
    this.el.addEventListener("mouseleave", () => {
      this.lenis.stop();
    });

    // restart scrolling when hover over the section
    this.el.addEventListener("mouseenter", () => {
      this.lenis.start();
    });
  }
}

export default SmoothScroll;
