const thisBreadcrumb = {
  title: "Edit Merchant Production",
  url: "/merchant-production/[id]",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
