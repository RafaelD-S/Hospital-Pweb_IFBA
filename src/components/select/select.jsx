import { useEffect, useRef, useState } from "react";
import "./select.styles.scss";

const Select = ({
  label,
  options,
  placeholder = "Selecione...",
  disabled = false,
  onChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionsState, setOptionsState] = useState(options);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    setOptionsState(options);
  }, [options]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!dropdownRef.current || !selectRef.current) return;
      if (
        !dropdownRef.current.contains(event.target) &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedItem = optionsState.find((opt) => opt.selected);

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const handleOptionClick = (optionValue) => {
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
    <div
      className={"select" + (disabled ? " select--disabled" : "")}
      ref={selectRef}
    >
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
        <div className="select__dropdown" ref={dropdownRef}>
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
