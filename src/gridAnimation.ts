import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class GridAnimation {
  el!: HTMLElement;
  gridItems!: any;
  grid!: any;

  constructor(screen?: HTMLElement) {
    if (!screen) return;

    this.el = screen;
    this.grid = this.el.querySelector(".cards");
    this.gridItems = this.grid.querySelectorAll(".card");

    this.gridAnimation();
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
        );
    });
  }
}

export default GridAnimation;
