import * as yup from "yup";
import { FormFieldType } from "./types";

// const validationGenerator = {
//   "required": yup.string().required('is required'),

//   "min-2": yup.string().min(2, 'minimum 2 characters'),
//   "min-4": yup.string().min(4, 'minimum 4 characters'),
//   "min-8": yup.string().min(8, 'minimum 8 characters'),
//   "min-16": yup.string().min(16, 'minimum 16 characters'),

//   "max-2": yup.string().max(2, 'maximum 2 characters'),
//   "max-4": yup.string().max(4, 'maximum 4 characters'),
//   "max-8": yup.string().max(8, 'maximum 8 characters'),
//   "max-16": yup.string().max(16, 'maximum 16 characters'),

//   "url": yup.string().url('url format is not correct').nullable(),
//   "email": yup.string().url('email format is not correct').nullable(),
// }

export const yupValidator = (field: FormFieldType) => {
  const messageRequired = `${field?.name} is required`

  if (field?.customValidation) {
    return field?.customValidation
  } else if (field?.required) {
    switch (field?.type) {
      case 'text':
        return yup.string().required(messageRequired);
        break;

      case 'number':
        return yup.string().required(messageRequired);
        break;
    
      default:
        break;
    }
  }
  
  return null;
}
