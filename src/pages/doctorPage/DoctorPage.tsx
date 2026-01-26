import { useState } from "react";
import Input from "../../components/input/Input";
import List from "../../components/list/List";
import type { IListItem } from "../../components/list/models/list.interface";
import Modal from "../../components/modal/Modal";
import Select from "../../components/select/select";

type Doctor = IListItem & {
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

const DoctorPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const doctorsMock: Doctor[] = [
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

  return (
    <div className="doctor-page">
      <List
        items={doctorsMock}
        registrationTitle="Cadastrar Médico"
        onEditClick={(item) => setSelectedDoctor(item)}
      />

      {selectedDoctor && (
        <Modal isOpen={true} onClickOutside={() => setSelectedDoctor(null)}>
          <Modal.Title>Editar Médico</Modal.Title>

          <Input
            label="Nome"
            placeholder="Digite o nome completo"
            defaultValue={selectedDoctor.title}
          />

          <Input
            label="Email"
            placeholder="Digite o email"
            type="email"
            defaultValue={selectedDoctor.email}
          />
          <Input
            label="Telefone"
            placeholder="Digite o telefone"
            type="tel"
            defaultValue={selectedDoctor.telefone}
          />
          <Input
            label="CRM"
            placeholder="Digite o CRM"
            type="text"
            defaultValue={selectedDoctor.crm}
          />
          <Input
            label="Logradouro"
            placeholder="Digite o logradouro"
            defaultValue={selectedDoctor.logradouro}
          />
          <Input
            label="Número"
            placeholder="Digite o número"
            type="text"
            defaultValue={selectedDoctor.numero}
          />
          <Input
            label="Complemento"
            placeholder="Digite o complemento"
            defaultValue={selectedDoctor.complemento}
          />
          <Input
            label="Bairro"
            placeholder="Digite o bairro"
            type="text"
            defaultValue={selectedDoctor.bairro}
          />
          <Input
            label="Cidade"
            placeholder="Digite a cidade"
            type="text"
            defaultValue={selectedDoctor.cidade}
          />
          <Input
            label="Estado"
            placeholder="Digite o estado"
            type="text"
            defaultValue={selectedDoctor.estado}
          />
          <Input
            label="CEP"
            placeholder="Digite o CEP"
            type="text"
            defaultValue={selectedDoctor.cep}
          />

          <Select
            label="Especialidade"
            onChange={() => {}}
            options={[
              {
                label: "Ortopedia",
                value: "0",
                selected: selectedDoctor.description === "Ortopedista",
              },
              {
                label: "Cardiologia",
                value: "1",
                selected: selectedDoctor.description === "Cardiologista",
              },
              {
                label: "Ginecologia",
                value: "2",
                selected: selectedDoctor.description === "Ginecologista",
              },
              {
                label: "Dermatologia",
                value: "3",
                selected: selectedDoctor.description === "Dermatologista",
              },
            ]}
          />

          <Modal.Button onClick={() => setSelectedDoctor(null)}>
            Salvar
          </Modal.Button>
        </Modal>
      )}
    </div>
  );
};

export default DoctorPage;
