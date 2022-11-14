import { generateBreadcrumb } from "reusables/utilities";
import CARD from './card';

const thisBreadcrumb = {
  title: "FDS",
  url: "/fds",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
  ...generateBreadcrumb(CARD.breadcrumb, [thisBreadcrumb]),
}

const route = {
  ...thisBreadcrumb,
  breadcrumb,
  CARD
};

export default route
