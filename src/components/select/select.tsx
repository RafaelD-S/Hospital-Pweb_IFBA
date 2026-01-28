import { useEffect, useState } from "react";
import type { ISelect } from "./select.interface";
import "./select.styles.scss";

const Select = ({
  label,
  options,
  placeholder = "Selecione...",
  disabled = false,
  onChange,
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionsState, setOptionsState] = useState(options);

  useEffect(() => {
    setOptionsState(options);
  }, [options]);

  const selectedItem = optionsState.find((opt) => opt.selected);

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((o) => !o);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setOptionsState((prevOptions) =>
      prevOptions.map((opt) => ({
        ...opt,
        selected: opt.value === optionValue,
      })),
    );

    setIsOpen(false);
  };

  return (
    <div className={"select" + (disabled ? " select--disabled" : "")}>
      <label className="select__label" htmlFor={`select-component-${label}`}>
        {label}
      </label>

      <div
        id={`select-component-${label}`}
        className="select__field"
        onClick={toggleOpen}
      >
        <h4 className="select__field__text">
          {selectedItem ? selectedItem.label : placeholder}
        </h4>
      </div>

      {isOpen && (
        <div className="select__dropdown">
          {optionsState.map((option) => {
            const optionClasses = ["select__dropdown__item"];
            if (option.selected)
              optionClasses.push("select__dropdown__item--selected");

            return (
              <div
                key={option.value}
                className={optionClasses.join(" ")}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
