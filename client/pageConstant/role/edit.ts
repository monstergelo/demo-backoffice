const thisBreadcrumb = {
  title: "Edit Role",
  url: "/role/[id]",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
