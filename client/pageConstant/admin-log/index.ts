import { generateBreadcrumb } from 'reusables/utilities';

const thisBreadcrumb = {
  title: "Admin Log",
  url: "/admin-log",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
}

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route
