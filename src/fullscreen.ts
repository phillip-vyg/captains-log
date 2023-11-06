import gsap from "gsap";
import Flip from "gsap/Flip";
import Draggable from "gsap/Draggable";
import { CARDS } from "./globals";
import InertiaPlugin from "gsap/InertiaPlugin";

gsap.registerPlugin(Flip, Draggable, InertiaPlugin);

class Fullscreen {
  public elements;
  public container: HTMLElement | null;
  public close: HTMLElement | null;
  public gallery: HTMLElement | null;
  public galleryCaption: HTMLElement | null;
  public activeItem!: HTMLElement | null;
  public state!: Flip.FlipState;

  constructor() {
    // From global.js, NodeList of all cards
    this.elements = [...CARDS];
    // Fullscreen elements
    this.container = document.querySelector(".fullscreen");
    this.close = document.querySelector(".fullscreen__close");
    // Gallery elements
    this.gallery = document.querySelector(".gallery");
    this.galleryCaption = document.querySelector(".gallery__caption");

    // initiate any event listeners
    this.events();
  }

  events() {
    // Close the fullscreen mode on click of button
    this.close?.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeFullsreen();
    });

    // Close the fullscreen mode on escape
    window.addEventListener("keydown", (e) => {
      // Only action when fullscreen is active
      if (!this.container?.classList.contains("fullscreen--active")) return;
      if (e.code === "Escape") this.closeFullsreen();
    });

    // Set up each card
    this.elements.forEach((element) => {
      element.addEventListener("click", () => {
        // Set the card as the active item
        this.activeItem = element;
        const thumbnail = element.querySelector(".card__media--inner");
        const script =
          element.querySelector("script") &&
          element.querySelector("script")!.textContent
            ? element.querySelector("script")!.textContent
            : "{}";
        const json = JSON.parse(script!);

        // Add items into gallery based on json data
        this.insertGalleryItems(json);

        // Set fullscreen container as visible
        gsap.set(this.container, {
          display: "block",
        });

        // Fit the container to the img within the clicked element
        // fitChild makes sure it is just the image that animates instead of the entire container
        Flip.fit(this.container, thumbnail, {
          scale: true,
          fitChild: this.gallery?.querySelector(
            ".gallery__item:first-child img"
          ),
        });

        // Store the state of the container
        this.state = Flip.getState(this.container);

        // Hide the active card so we don't see it during scale up
        this.activeItem.style.opacity = "0";

        // Initialise the Flip animation, which sets the right dimensions etc
        Flip.from(this.state, {
          absolute: true,
          duration: 0,
          scale: true,
        });

        // Scale up the container
        gsap.to(this.container, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.8)",
          onComplete: () => {
            // Make it interactive
            gsap.set(this.container, {
              pointerEvents: "all",
            });

            // Add active clasas
            this.container?.classList.add("fullscreen--active");

            // array of offsets that the Draggable plugin will snap to
            let snapOffets: number[] = [];

            // Loop over each gallery item and store the left offset as a snap point
            this.gallery?.querySelectorAll(".gallery__item").forEach((el) => {
              const element = el as HTMLElement;
              snapOffets.push(element.offsetLeft * -1);
            });

            // Initiate Draggable on the gallery
            Draggable.create(this.gallery, {
              type: "x",
              inertia: true,
              snap: snapOffets,
            });
          },
        });

        // Fade in the caption
        gsap.to(this.galleryCaption, {
          delay: 0.5,
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power3.out",
        });

        const items = this.gallery?.querySelectorAll(
          ".gallery__item:not(:first-child)"
        );

        // Fade in the remaining gallery items
        if (items) {
          gsap.to(items, {
            delay: 0.6,
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power3.out",
          });
        }

        // Fade in the close button
        gsap.to(this.close, {
          delay: 0.6,
          opacity: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      });
    });
  }

  // Add the gallery content
  insertGalleryItems(data: {
    images: string | any[];
    title: any;
    description: any;
    timeago: any;
  }) {
    let galleryHTML = "";

    // Loop over each image object and add to HTML string
    if (data.images) {
      for (let index = 0; index < data.images.length; index++) {
        const img = data.images[index];
        galleryHTML += this.galleryItemTemplate(img);
      }
    }

    // Inject gallery HTML string into gallery container
    this.gallery!.innerHTML = galleryHTML;

    let captionHTML = ``;

    // Add the title of the card to the caption
    if (data.title) {
      captionHTML = `<p class="text-lg mb-2"><strong>${data.title}</strong></p>`;
    }

    // Add the description of the card to the caption
    if (data.description) {
      captionHTML += `<p>${data.description}</p>`;
    }

    // Add the date of the card to the caption
    if (data.timeago) {
      captionHTML += `<time class=" block mt-2 text-xs italic">${data.timeago}</time>`;
    }

    // Inject caption HTML string into caption container
    this.galleryCaption!.innerHTML = captionHTML;
  }

  // Creates gallery item HTML
  galleryItemTemplate(src: any) {
    return `
      <div class="gallery__item h-full flex-shrink-0">
        <figure class="h-full">
          <img
            class="gallery__media w-auto h-full object-cover"
            src="${src}"
            alt=""
            loading="lazy"
          />
        </figure>
      </div>
    `;
  }

  // Close the fullscreen container
  closeFullsreen() {
    // Removes the active class
    this.container?.classList.remove("fullscreen--active");

    // Quickly hide the elements that aren't the iamge
    gsap.to(
      [
        this.galleryCaption,
        this.close,
        this.gallery?.querySelectorAll(".gallery__item:not(:first-child)"),
      ],
      {
        opacity: 0,
        duration: 0.2,
        ease: "power3.out",
      }
    );

    // Revert to original state and reset on complete
    Flip.to(this.state, {
      absolute: true,
      duration: 0.3,
      ease: "back.out(1.1)",
      scale: true,
      clearProps: "all",
      onComplete: () => this.reset(),
    });
  }

  // Remove content and styles where needed
  reset() {
    this.activeItem!.style.opacity = "1";
    this.container!.removeAttribute("style");
    this.gallery!.innerHTML = "";
    this.galleryCaption!.innerHTML = "";
    gsap.set(this.galleryCaption, {
      opacity: 0,
      x: 50,
    });
    this.activeItem = null;
  }
}

export default Fullscreen;
