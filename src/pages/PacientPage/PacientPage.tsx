import { useState } from "react";
import List from "../../components/list/List";
import Input from "../../components/input/Input";
import Modal from "../../components/modal/Modal";
import type { IListItem } from "../../components/list/models/list.interface";
import { pacientMock, type IPacientMock } from "../../mocks/pacient.mock";
import Button from "../../components/button/Button";

const PacientPage = () => {
  const [pacients, setPacients] = useState<IPacientMock[]>(pacientMock);
  const [selectedPacient, setSelectedPacient] = useState<IPacientMock | null>(
    null,
  );

  const handleRemovePacient = (item: IListItem) => {
    setPacients((prev) =>
      prev.map((p) => (p.title === item.title ? { ...p, disabled: true } : p)),
    );
  };

  const handleRestorePacient = (item: IListItem) => {
    setPacients((prev) =>
      prev.map((p) => (p.title === item.title ? { ...p, disabled: false } : p)),
    );
  };

  const handleRegisterPacient = () => {
    setSelectedPacient({} as IPacientMock);
  };

  return (
    <div className="pacient-page">
      <List
        items={pacients}
        registrationTitle="Cadastrar Paciente"
        onEditClick={(item) =>
          setSelectedPacient(
            pacients.find((p) => p.title === item.title) ?? null,
          )
        }
        onRegistrationClick={handleRegisterPacient}
        onRemoveClick={handleRemovePacient}
        onRestoreClick={handleRestorePacient}
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

          <Button onClick={() => setSelectedPacient(null)}>Salvar</Button>
        </Modal>
      )}
    </div>
  );
};

export default PacientPage;
