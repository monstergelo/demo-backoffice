const thisBreadcrumb = {
  title: "Edit Disbursement",
  url: "/disbursement/[id]",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
};

const route = {
  ...thisBreadcrumb,
  breadcrumb,
};

export default route;
