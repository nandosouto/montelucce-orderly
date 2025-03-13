
export type Order = {
  id: string;
  nome_cliente: string;
  email: string;
  cpf: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  preco_produto: number;
  marca_produto: string;
  custo_envio: number;
  data_pedido: Date;
  lucro_calculado?: number;
  custo_produto?: number;
  preco_venda?: number;
};

export type PeriodFilter = 
  | 'hoje' 
  | 'ontem' 
  | 'ultimos7dias' 
  | 'ultimos30dias' 
  | 'ultimos3meses' 
  | 'ultimos6meses' 
  | 'ultimoano';

export type DashboardMetric = {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
};
