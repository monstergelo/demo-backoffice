const thisBreadcrumb = {
  title: "Add Role",
  url: "/role/new",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
