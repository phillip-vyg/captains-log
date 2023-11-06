import EffectCanvas from "./effectCanvas";

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
export default GridAnimation;
