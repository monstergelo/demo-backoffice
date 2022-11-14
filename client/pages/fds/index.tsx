import FDS from "module/FDS";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { FDS as PAGE, getBreadcrumb } from "pageConstant";

const FDSListPage: PageType<FormProps> = FDS;
FDSListPage.layout = BasicLayout;
FDSListPage.title = PAGE.title;

export const getServerSideProps = async () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(baseURL + '/fds', {
    method: 'GET',
    cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then((res) => res.json());

  return {
    props: {
      breadcrumb: getBreadcrumb(PAGE.title),
      paths: {
        card: PAGE.CARD.url,
      },
      data: response ?? {},
    },
  };
};

export default FDSListPage;
