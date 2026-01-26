import type { IInput } from "./input.interface";
import "./input.styles.scss";

const Input = ({ label, ...rest }: IInput) => {
  return (
    <div className="input">
      <label className="input__label" htmlFor={`input-component-${label}`}>
        {label}
      </label>
      <input
        id={`input-component-${label}`}
        className="input__field"
        {...rest}
        required
      />
    </div>
  );
};

export default Input;
