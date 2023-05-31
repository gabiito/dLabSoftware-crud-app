export interface RequestProps {
  pagination: {
    sortBy?: string;
    descending?: boolean;
    page: number;
    rowsPerPage?: number;
  };
}

export interface NotifyMessage {
  message: string;
  color: string;
}

export interface NotifyConfig {
  [key: string]: NotifyMessage;
}

export const ColumnsDefinition = [
  {
    name: 'id',
    field: 'id',
    label: 'ID',
    align: 'center',
  },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'center',
  },
  {
    name: 'price',
    field: 'price',
    label: 'Price',
    align: 'center',
  },
  {
    name: 'action',
    field: 'action',
    label: 'Action',
    align: 'center',
  },
];
