import { useState } from "react";
import List from "../../components/list/List";
import Input from "../../components/input/Input";
import Modal from "../../components/modal/Modal";
import type { IListItem } from "../../components/list/models/list.interface";

type Pacient = IListItem & {
  email: string;
  telefone: string;
  cpf: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

const PacientPage = () => {
  const [selectedPacient, setSelectedPacient] = useState<Pacient | null>(null);

  const pacientMock: Pacient[] = [
    {
      title: "Ana Costa",
      email: "ana.costa@email.com",
      telefone: "(11) 95555-4444",
      cpf: "123.456.789-00",
      logradouro: "Rua das Flores",
      numero: "200",
      complemento: "Bloco B, Apto 34",
      bairro: "Jardins",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01410-000",
      disabled: false,
    },
    {
      title: "Bruno Lima",
      email: "bruno.lima@email.com",
      telefone: "(21) 94444-5555",
      cpf: "987.654.321-00",
      logradouro: "Rua do Catete",
      numero: "780",
      complemento: "Casa",
      bairro: "Catete",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22220-000",
      disabled: false,
    },
    {
      title: "Carla Mendes",
      email: "carla.mendes@email.com",
      telefone: "(31) 93333-6666",
      cpf: "111.222.333-44",
      logradouro: "Av. Afonso Pena",
      numero: "1500",
      complemento: "Sala 1201",
      bairro: "Funcionários",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30130-003",
      disabled: true,
    },
  ];

  return (
    <div className="pacient-page">
      <List
        items={pacientMock}
        registrationTitle="Cadastrar Paciente"
        onEditClick={(item) => setSelectedPacient(item)}
      />

      {selectedPacient && (
        <Modal isOpen={true} onClickOutside={() => setSelectedPacient(null)}>
          <Modal.Title>Editar Paciente</Modal.Title>

          <Input
            label="Nome"
            placeholder="Digite o nome completo"
            defaultValue={selectedPacient.title}
          />

          <Input
            label="Email"
            placeholder="Digite o email"
            type="email"
            defaultValue={selectedPacient.email}
          />
          <Input
            label="Telefone"
            placeholder="Digite o telefone"
            type="tel"
            defaultValue={selectedPacient.telefone}
          />
          <Input
            label="CPF"
            placeholder="Digite o CPF"
            type="text"
            defaultValue={selectedPacient.cpf}
          />
          <Input
            label="Logradouro"
            placeholder="Digite o logradouro"
            defaultValue={selectedPacient.logradouro}
          />
          <Input
            label="Número"
            placeholder="Digite o número"
            type="text"
            defaultValue={selectedPacient.numero}
          />
          <Input
            label="Complemento"
            placeholder="Digite o complemento"
            defaultValue={selectedPacient.complemento}
          />
          <Input
            label="Bairro"
            placeholder="Digite o bairro"
            type="text"
            defaultValue={selectedPacient.bairro}
          />
          <Input
            label="Cidade"
            placeholder="Digite a cidade"
            type="text"
            defaultValue={selectedPacient.cidade}
          />
          <Input
            label="Estado"
            placeholder="Digite o estado"
            type="text"
            defaultValue={selectedPacient.estado}
          />
          <Input
            label="CEP"
            placeholder="Digite o CEP"
            type="text"
            defaultValue={selectedPacient.cep}
          />

          <Modal.Button onClick={() => setSelectedPacient(null)}>
            Salvar
          </Modal.Button>
        </Modal>
      )}
    </div>
  );
};

export default PacientPage;
