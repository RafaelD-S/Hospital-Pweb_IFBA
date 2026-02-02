import Empty from "../../assets/empty.svg";
import "./emptyPage.styles.scss";

const EmptyPage = ({ title, description }) => {
  return (
    <div className="empty-page">
      <img src={Empty} alt="Empty" />
      <div className="empty-page__textbox">
        <h1 className="empty-page__title">{title}</h1>
        {description && (
          <h2 className="empty-page__description">{description}</h2>
        )}
      </div>
    </div>
  );
};

export default EmptyPage;
