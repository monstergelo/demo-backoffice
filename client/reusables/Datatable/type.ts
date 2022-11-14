import { Table } from "@tanstack/react-table";

export type Column = {
  name: string;
  label: string;
  header?: (info: unknown) => JSX.Element;
  [x: string]: any;
}

export interface DatatableProps {
  actionProps?: {
    rowIdentifier: string;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onAdd?: () => void;
    paths?: {
      [x: string]: string;
    };
  },
  columns: Column[];
  url: string;
  title?: string;
  initialState?: {[x:string]: any};
  manualRefresh?: number;
}