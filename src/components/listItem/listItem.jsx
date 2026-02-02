import "./list.styles.scss";

export const ListItem = ({
  title,
  description,
  disabled = false,
  subtitle,
  children,
  onClick = () => {},
}) => {
  const itemClasses = ["list__item"];
  if (disabled) itemClasses.push("list__item--disabled");

  return (
    <div className={itemClasses.join(" ")} onClick={onClick}>
      <div className="list__item__textbox">
        {title && <h3 className="list__item__textbox__title">{title}</h3>}

        {subtitle && (
          <h4 className="list__item__textbox__subtitle">{subtitle}</h4>
        )}

        {description && (
          <p className="list__item__textbox__description">{description}</p>
        )}
      </div>

      <div className="list__item__actions">{children}</div>
    </div>
  );
};

export default ListItem;
