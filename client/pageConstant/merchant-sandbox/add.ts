const thisBreadcrumb = {
  title: "Add Merchant Sandbox",
  url: "/merchant-sandbox/new",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
