const permissionId = {
  'admin': 1,
  'role': 2,
  'production-merchant': 3,
  'sandbox-merchant': 4,
  'disbursement': 5,
  'fds': 6,
}

export const getPermissionsArray = (data: any) => {
  let permissions = [];
  if (data['admin'])                  permissions.push (permissionId['admin']);
  if (data['role'])                   permissions.push (permissionId['role']);
  if (data['production-merchant'])    permissions.push (permissionId['production-merchant']);
  if (data['sandbox-merchant'])       permissions.push (permissionId['sandbox-merchant']);
  if (data['disbursement'])           permissions.push (permissionId['disbursement']);
  if (data['fds'])                    permissions.push (permissionId['fds']);

  return permissions
}

export const getPermissionsDefaultValue = (data: any) => {
  const permissions = data?.permissions.reduce((obj: any, curr: any) => {
    return {
      ...obj,
      [curr]: true
    }
  }, {
    'admin': false,
    'role': false,
    'production-merchant': false,
    'sandbox-merchant': false,
    'disbursement': false,
    'fds': false,
  });
  

  return permissions
}

export const form = {
  title: 'Role Form',
  fields: [
    {
      name: 'name',
      label: 'name',
      type: 'text',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'permissions',
      label: 'Permissions',
      type: 'section',
      fieldSize: 12,
    },
    {
      name: 'admin',
      label: 'Admin',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'disbursement',
      label: 'Disbursement',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'fds',
      label: 'FDS',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'production-merchant',
      label: 'Production Merchant',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'sandbox-merchant',
      label: 'Sandbox Merchant',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
  ]
}