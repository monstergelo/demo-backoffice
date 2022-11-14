export const form = {
  title: 'FDS Form',
  fields: [
    {
      name: 'max_daily',
      label: 'Max Daily',
      type: 'number',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'max_monthly',
      label: 'Max Monthly',
      type: 'number',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'velocity_direct_debit_seconds',
      label: 'Velocity Direct Debit (seconds)',
      type: 'number',
      fieldSize: 12,
      required: true,
    },
  ]
}