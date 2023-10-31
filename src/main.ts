import "./style.scss";
import SmoothScroll from "./smoothScroll";
import MobileToggle from "./mobileToggle";
import { MOBILE_TOGGLE, SCREEN_LEFT, SCREEN_RIGHT } from "./globals";

new SmoothScroll(SCREEN_LEFT);
new SmoothScroll(SCREEN_RIGHT);
new MobileToggle(MOBILE_TOGGLE);
