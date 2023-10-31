import gsap from "gsap";
import { SCREEN_LEFT, SCREEN_RIGHT } from "./globals";

class MobileToggle {
  public el!: HTMLElement;
  public input!: HTMLInputElement | null;
  public duration!: number;
  public ease!: string;

  private _state: any;

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
    this.toggleContent();
  }

  constructor(button?: HTMLElement) {
    if (!button) return;

    this.el = button;
    this.input = this.el.querySelector("input");

    this.duration = 0.5;
    this.ease = "power3.out";

    this.input?.addEventListener("change", () => {
      if (this.input?.checked) this.state = "life";
      else this.state = "work";
    });
  }

  toggleContent() {
    const leftX = this._state === "life" ? "-100%" : 0;
    const rightX = this._state === "life" ? 0 : "100%";

    gsap.to(SCREEN_LEFT, {
      x: leftX,
      duration: this.duration,
      ease: this.ease,
    });

    gsap.to(SCREEN_RIGHT, {
      x: rightX,
      duration: this.duration,
      ease: this.ease,
    });
  }
}

export default MobileToggle;
