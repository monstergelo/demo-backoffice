const thisBreadcrumb = {
  title: "Add Merchant Production",
  url: "/merchant-production/new",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
