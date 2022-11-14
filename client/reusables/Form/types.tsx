import { SubmitHandler, UseFormProps, UseFormReturn } from "react-hook-form";

export type FormFieldType = {
  name: string;
  label: string;
  type: string;
  fieldSize: number;
  required?: boolean;
  option?: string;
  optionIdentifier?: string;
  url?: string;
  customRender?: (field: FormFieldType, form: UseFormReturn) => JSX.Element;
  customValidation?: any;
};

export type option = {
  id: string | number;
  label: string;
}

export type FormType = {
  title: string;
  fields: FormFieldType[];
  onSubmit: SubmitHandler<any>;
  formOptions?: UseFormProps;
  options?: {
    [x: string]: option[]
  }
}