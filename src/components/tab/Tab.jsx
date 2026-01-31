import { useEffect, useState } from "react";
import "./tab.styles.scss";
import { useLocation } from "react-router-dom";

const Tab = ({ items = [], onClick = () => {} }) => {
  const location = useLocation();
  const [itemsState, setItemsState] = useState(items);

  const setCurrentActive = (value) => {
    setItemsState((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        active: item.value === value,
      })),
    );
  };

  const handleClick = (itemClicked) => {
    setCurrentActive(itemClicked.value);
    onClick(itemClicked);
  };

  useEffect(() => {
    setCurrentActive(location.pathname.substring(1));
  }, [location]);

  return (
    <nav className="tab">
      {itemsState.map((item) => {
        const tabClasses = ["tab__item"];
        if (item.active) tabClasses.push("tab__item--active");

        return (
          <div
            className={tabClasses.join(" ")}
            key={item.value}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </div>
        );
      })}
    </nav>
  );
};

export default Tab;
