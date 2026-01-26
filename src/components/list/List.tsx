import type { IList } from "./models/list.interface";
import "./list.styles.scss";
import ListItem from "./views/listItem";

const List = ({
  items = [],
  registrationTitle = "Registrar",
  onRegistrationClick = () => {},
  onEditClick = () => {},
  onRestoreClick = () => {},
  onRemoveClick = () => {},
}: IList) => {
  return (
    <div className="list">
      <ListItem
        onClick={onRegistrationClick}
        title={registrationTitle}
        type="registration"
      />

      {items.map((item, index) => (
        <ListItem
          {...item}
          key={index}
          onEditClick={() => onEditClick(item)}
          onRemoveClick={() => onRemoveClick(item)}
          onRestoreClick={() => onRestoreClick(item)}
        />
      ))}
    </div>
  );
};

export default List;
