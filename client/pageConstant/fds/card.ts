const thisBreadcrumb = {
  title: "FDS Card Tracking",
  url: "/fds/card",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
