import * as yup from "yup";

export const form = {
  title: 'Merchant Form',
  fields: [
    {
      name: 'name',
      label: 'name',
      type: 'text',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'verified',
      label: 'Verified',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().url('url format is not correct')
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().email('email format is not correct')
    },
    {
      name: 'password',
      label: 'Password',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().min(8, 'minimum 8 characters'),
    },
  ]
}

export const documents = [
  {
    id: 'akta_pendirian',
    label: 'Akta Pendirian',
  },
  {
    id: 'akta_perubahan',
    label: 'Akta Perubahan',
  },
  {
    id: 'bagan_kepemilikan_saham',
    label: 'Bagan Kepemilikan Saham',
  },
  {
    id: 'surat_kuasa',
    label: 'Surat Kuasa',
  },
  {
    id: 'nib_perusahaan',
    label: 'NIB perusahaan',
  },
  {
    id: 'npwp_pemegang_saham',
    label: 'NPWP Pemegang Saham',
  },
  {
    id: 'npwp_perusahaan',
    label: 'NPWP Perusahaan',
  },
  {
    id: 'identitas_pribadi_komisaris_direksi',
    label: 'Komisari Direksi',
  },
  {
    id: 'identitas_pribadi_pemegang_saham',
    label: 'Pemegang Saham',
  },
]

export const details = [
  {
    id: 'website',
    label: 'Website',
  },
  {
    id: 'pic_phone_number',
    label: 'PIC Phone Number',
  },
  {
    id: 'entity_detail',
    label: 'Entity Detail',
  },
  {
    id: 'business_line',
    label: 'Business Line',
  },
  {
    id: 'number_of_employee',
    label: 'Number of Employee',
  },
  {
    id: 'transaction_size_monthly',
    label: 'Transaction Size Monthly',
  },
  {
    id: 'pic_role',
    label: 'PiC Role',
  },
  {
    id: 'merchant_detail_type',
    label: 'Merchant Type',
  },
]