import "./style.scss";
import SmoothScroll from "./smoothScroll";
import MobileToggle from "./mobileToggle";
import Fullscreen from "./fullscreen";
import { MOBILE_TOGGLE, SCREEN_LEFT, SCREEN_RIGHT } from "./globals";
import GridAnimation from "./gridAnimation";

new MobileToggle(MOBILE_TOGGLE);
new SmoothScroll(SCREEN_LEFT);
new SmoothScroll(SCREEN_RIGHT);
new GridAnimation(SCREEN_LEFT);
new GridAnimation(SCREEN_RIGHT);
new Fullscreen();
