import { generateBreadcrumb } from 'reusables/utilities';
import ADD from './add';
import EDIT from './edit';

const thisBreadcrumb = {
  title: "Admin",
  url: "/admin",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
  ...generateBreadcrumb(ADD.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(EDIT.breadcrumb, [thisBreadcrumb]),
}

const route = {
  ...thisBreadcrumb,
  breadcrumb,
  ADD,
  EDIT,
};

export default route
