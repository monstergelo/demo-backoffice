export const options = {
  status: [
    {
      id: 'PROCESS',
      label: 'PROCESS'
    },
    {
      id: 'FAILED',
      label: 'FAILED'
    },
    {
      id: 'INITIATE',
      label: 'INITIATE'
    },
    {
      id: 'SUCCESS',
      label: 'SUCCESS'
    },
  ]
}

export const form = {
  title: 'Disbursement Form',
  fields: [
    {
      name: 'status',
      label: 'Status',
      type: 'autocomplete',
      option: 'status',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'text',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'merchant',
      label: 'Merchant',
      type: 'reference',
      fieldSize: 12,
      required: true,
      url: '/merchant/autocomplete'
    },
    {
      name: 'bank-account',
      label: 'Bank Account',
      type: 'reference',
      fieldSize: 12,
      required: true,
      url: '/bank-account/autocomplete'
    },
  ]
}