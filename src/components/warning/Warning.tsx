import Button from "../button/Button";
import type { IWarning } from "./warning.interface";
import "./warning.styles.scss";
import ErrorIcon from "../../assets/error.svg";

const Warning = ({ message, action, onActionClick = () => {} }: IWarning) => {
  return (
    <div className="warning">
      <div className="warning__container">
        <img src={ErrorIcon} alt="Error" />
        <h2 className="warning__message">{message}</h2>
        {action && (
          <Button value="error" onClick={onActionClick}>
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Warning;
