import Button from "../button/Button";
import "./warning.styles.scss";
import ErrorIcon from "../../assets/error.svg";

const Warning = ({ message, action, onActionClick = () => {} }) => {
  return (
    <div className="warning">
      <div className="warning__container">
        <img src={ErrorIcon} alt="Error" />
        <h2 className="warning__message">{message}</h2>
        {action && (
          <Button value="error" onClick={onActionClick} autoFocus>
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Warning;
