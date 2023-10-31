import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BODY } from "./globals";

gsap.registerPlugin(ScrollTrigger);

class SmoothScroll {
  el!: HTMLElement;
  content!: HTMLElement;
  lenis!: Lenis;
  gridItems!: any;
  grid!: any;

  constructor(screen?: HTMLElement) {
    if (!screen) return;

    this.el = screen;
    this.content = this.el.querySelector(".screen__content") as HTMLElement;
    this.grid = this.el.querySelector(".cards");
    this.gridItems = this.grid.querySelectorAll(".card");

    this.init();
  }

  init() {
    // Kicks off Lenis
    this.lenis = new Lenis({
      wrapper: this.el,
      content: this.content,
      lerp: 0.15, // Lower values create a smoother scroll effect
      smoothWheel: true, // Enables smooth scrolling for mouse wheel events
    });

    // Keeps Lenis ticking over
    requestAnimationFrame((t) => this.raf(t));

    // initiate some event handlers
    this.events();
    this.gridAnimation();
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

  gridAnimation() {
    // Loop through each grid item to add animations
    this.gridItems.forEach((item: any) => {
      // Get the previous element sibling for the current item
      const previousElementSibling = item.previousElementSibling;
      // Determine if the current item is on the left side based on its position relative to the previous item
      const isLeftSide =
        previousElementSibling &&
        item.offsetLeft + item.offsetWidth <=
          previousElementSibling.offsetLeft + 1;
      // Determine the origin for transformations (either 100 or 0 depending on position)
      const originX = isLeftSide ? 100 : 0;
      const start =
        item.offsetTop - window.innerHeight + window.innerHeight * 0.25;
      const end = start + window.innerHeight * 0.25;

      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
          scrollTrigger: {
            scroller: this.el,
            trigger: item,
            start: start,
            end: end,
            scrub: true,
            // markers: true,
          },
        })
        .fromTo(
          item.querySelector(".card__media"),
          {
            scale: 0,
            transformOrigin: `${originX}% 0%`,
          },
          {
            scale: 1,
          }
        )
        .fromTo(
          item.querySelector(".card__media--inner"),
          {
            scale: 5,
            transformOrigin: `${originX}% 0%`,
          },
          {
            scale: 1,
          },
          0
        )
        .fromTo(
          item.querySelector(".card__caption"),
          {
            xPercent: () => (isLeftSide ? 100 : -100),
            opacity: 0,
          },
          {
            ease: "power1",
            xPercent: 0,
            opacity: 1,
          },
          0
        );
    });
  }
}

export default SmoothScroll;
