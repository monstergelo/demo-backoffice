import { NextComponentType, NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import { ComponentType } from "react";
import { BreadcrumbItemProps } from "reusables/types";

export type PageType<props> = NextPage<props> & {
  layout?: ComponentType<any>;
  title?: string;
  breadCrumb?: BreadcrumbItemProps[];
};

export type ModuleType = NextComponentType<NextPageContext, any, {}> & {
  layout?: ComponentType<any>;
  title?: string;
};

export type MyAppProps = AppProps & {
  Component: ModuleType;
};

export interface FormProps {
  onSubmitRedirect: string;
  [x: string]: any;
}