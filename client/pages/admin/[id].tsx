import AdminForm from "module/Admin/edit";
import BasicLayout from "module/BasicLayout";
import { FormProps, PageType } from "module/types";
import { ADMIN as PAGE, getBreadcrumb } from "pageConstant";

const AdminFormPage: PageType<FormProps> = AdminForm;
AdminFormPage.layout = BasicLayout;
AdminFormPage.title = PAGE.EDIT.title;

// export const getStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

export async function getServerSideProps({ params }: any) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [adminResponse, roleResponse] = await Promise.all([
    fetch(baseURL + '/admin/' + params?.id, {
      method: 'GET',
      cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((res) => res.json()),
    fetch(baseURL + '/role', {
      method: 'GET',
      cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((res) => res.json()),
  ])

  var breadcrumb = getBreadcrumb(PAGE.EDIT.title);
  breadcrumb[2] = {
    ...breadcrumb[2],
    query: {
      id: params?.id
    }
  }

  return {
    props: {
      breadcrumb: breadcrumb,
      onSubmitRedirect: PAGE.url,
      data: adminResponse ?? {},
      options: {
        role: roleResponse?.map((role: any) => ({...role, label: `${role?.name}`, id: `${role?.id}`}))  ??  [],
      },
      id: params?.id,
    },
  };
}

// export const getStaticProps = async ({ params }: any) => {
//   const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
//   const [adminResponse, roleResponse] = await Promise.all([
//     fetch(baseURL + '/admin/' + params?.id, {
//       method: 'GET',
//       cache: 'no-cache',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//     }).then((res) => res.json()),
//     fetch(baseURL + '/role', {
//       method: 'GET',
//       cache: 'no-cache',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//     }).then((res) => res.json()),
//   ])

//   var breadcrumb = getBreadcrumb(PAGE.EDIT.title);
//   breadcrumb[2] = {
//     ...breadcrumb[2],
//     query: {
//       id: params?.id
//     }
//   }

//   return {
//     props: {
//       breadcrumb: breadcrumb,
//       onSubmitRedirect: PAGE.url,
//       data: adminResponse ?? {},
//       options: {
//         role: roleResponse.map((role: any) => ({...role, label: `${role?.name}`, id: `${role?.id}`})),
//       },
//       id: params?.id,
//     },
//     revalidate: 10,
//   };
// };

export default AdminFormPage;
