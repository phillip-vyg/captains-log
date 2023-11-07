import GridCanvas from "./gridCanvas";

class GridAnimation {
  el!: HTMLElement;
  gridItems!: any;
  grid!: any;

  constructor(screen?: HTMLElement) {
    if (!screen) return;

    this.el = screen;
    this.grid = this.el.querySelector(".cards");
    this.gridItems = this.grid.querySelectorAll(".card");

    new GridCanvas(this.el);
  }
}
export default GridAnimation;
