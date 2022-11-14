const thisBreadcrumb = {
  title: "Edit Admin",
  url: "/admin/[id]",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
