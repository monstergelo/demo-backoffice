const thisBreadcrumb = {
  title: "Add Admin",
  url: "/admin/new",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
