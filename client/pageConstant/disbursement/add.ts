const thisBreadcrumb = {
  title: "Add Disbursement",
  url: "/disbursement/new",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
