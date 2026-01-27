import { useState } from "react";
import Input from "../../components/input/Input";
import List from "../../components/list/List";
import type { IListItem } from "../../components/list/models/list.interface";
import Modal from "../../components/modal/Modal";
import Select from "../../components/select/select";
import { doctorsMock, type IDoctorMock } from "../../mocks/doctor.mock";
import Button from "../../components/button/Button";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState<IDoctorMock[]>(doctorsMock);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctorMock | null>(
    null,
  );

  const handleRemoveDoctor = (item: IListItem) => {
    setDoctors((prev) =>
      prev.map((d) => (d.title === item.title ? { ...d, disabled: true } : d)),
    );
  };

  const handleRestoreDoctor = (item: IListItem) => {
    setDoctors((prev) =>
      prev.map((d) => (d.title === item.title ? { ...d, disabled: false } : d)),
    );
  };

  const handleRegisterDoctor = () => {
    setSelectedDoctor({} as IDoctorMock);
  };

  return (
    <div className="doctor-page">
      <List
        items={doctors}
        registrationTitle="Cadastrar Médico"
        onEditClick={(item) =>
          setSelectedDoctor(doctors.find((d) => d.title === item.title) ?? null)
        }
        onRemoveClick={handleRemoveDoctor}
        onRestoreClick={handleRestoreDoctor}
        onRegistrationClick={handleRegisterDoctor}
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

          <Button type="submit" onClick={() => setSelectedDoctor(null)}>
            Salvar
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default DoctorPage;
