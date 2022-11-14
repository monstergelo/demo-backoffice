export interface BasePageProps {
  children?: JSX.Element;
  title?: string;
}

export interface GenericProviderProps {
  children?: JSX.Element;
}

export interface customRequestInit extends RequestInit {
  params?: any
}

export type fetchType = (x: string, option?: customRequestInit) => Promise<any>

export interface FetchContextProps {
  baseURL: string,
  options: RequestInit,
  get: fetchType,
  put: fetchType,
  post: fetchType,
  remove: fetchType,
  loading: boolean
}

export interface DialogProps {
  title: string;
  content: JSX.Element;
  action: JSX.Element;
  size?: 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
}
export interface DialogContextProps {
  createDialog: ({
    title,
    content,
    action
  }: DialogProps) => void,
  handleClose: () => void,
  handleOpen: () => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean,
}

export type userType = {
  name?: string;
  email?: string;
}
