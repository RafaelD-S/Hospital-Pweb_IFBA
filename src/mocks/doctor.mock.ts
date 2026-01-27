import type { IListItem } from "../components/list/models/list.interface";

export type IDoctorMock = IListItem & {
  email: string;
  telefone: string;
  crm: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

export const doctorsMock: IDoctorMock[] = [
  {
    title: "Dr. João Silva",
    description: "Cardiologista",
    email: "joao.silva@hospital.com",
    telefone: "(11) 98888-1111",
    crm: "CRM-SP 123456",
    logradouro: "Rua das Palmeiras",
    numero: "100",
    complemento: "Apto 12",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01000-000",
    disabled: false,
  },
  {
    title: "Dra. Maria Oliveira",
    description: "Dermatologista",
    email: "maria.oliveira@hospital.com",
    telefone: "(21) 97777-2222",
    crm: "CRM-RJ 654321",
    logradouro: "Av. Atlântica",
    numero: "2500",
    complemento: "Sala 305",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "22070-000",
    disabled: false,
  },
  {
    title: "Dr. Pedro Santos",
    description: "Ortopedista",
    email: "pedro.santos@hospital.com",
    telefone: "(31) 96666-3333",
    crm: "CRM-MG 112233",
    logradouro: "Rua das Acácias",
    numero: "45",
    complemento: "Casa",
    bairro: "Savassi",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30140-000",
    disabled: true,
  },
];
