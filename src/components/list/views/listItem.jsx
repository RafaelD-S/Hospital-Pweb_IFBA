import EditIcon from "../../../assets/edit.svg";
import RemoveIcon from "../../../assets/remove.svg";
import AddIcon from "../../../assets/add.svg";
import RestoreIcon from "../../../assets/restore.svg";

const ListItem = ({
  title,
  description,
  type = "item",
  disabled = false,
  hasEditButton = true,
  onEditClick = () => {},
  onClick = () => {},
  onRemoveClick = () => {},
  onRestoreClick = () => {},
}) => {
  if (type === "registration") {
    return (
      <div className="list__item__registration" onClick={onClick}>
        {title && <h3 className="list__item__registration__title">{title}</h3>}
        <img src={AddIcon} alt="add icon" />
      </div>
    );
  }

  const itemClasses = ["list__item"];
  if (disabled) itemClasses.push("list__item--disabled");

  return (
    <div className={itemClasses.join(" ")} onClick={onClick}>
      <div className="list__item__textbox">
        {title && <h3 className="list__item__textbox__title">{title}</h3>}

        {description && (
          <p className="list__item__textbox__description">{description}</p>
        )}
      </div>

      <div className="list__item__actions">
        {!disabled ? (
          <>
            {hasEditButton && (
              <img src={EditIcon} alt="edit icon" onClick={onEditClick} />
            )}
            <img src={RemoveIcon} alt="remove icon" onClick={onRemoveClick} />
          </>
        ) : (
          <img src={RestoreIcon} alt="restore icon" onClick={onRestoreClick} />
        )}
      </div>
    </div>
  );
};

export default ListItem;
