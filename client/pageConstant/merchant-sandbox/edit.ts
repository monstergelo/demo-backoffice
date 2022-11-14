const thisBreadcrumb = {
  title: "Edit Merchant Sandbox",
  url: "/merchant-sandbox/[id]",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
