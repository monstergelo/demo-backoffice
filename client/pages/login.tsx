import LOGIN from "module/Login";
import { PageType } from "module/types";
import { LOGIN as PAGE } from "pageConstant";

const LoginPage: PageType <{}>= LOGIN;
LoginPage.layout =  (({ children }) => <>{children}</>);
LoginPage.title = PAGE.title;

export default LoginPage;
