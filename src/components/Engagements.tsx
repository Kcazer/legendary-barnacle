import Engagement from './Engagement';
import Styles from './Engagements.module.scss';

type Props = {
  image: string;
  title: string;
  items: {
      text: string;
      link: string;
      image: string;
      color: string;
  }[];
}

const Engagements = ({ title, image, items }: Props) => {
  return (
    <section className={Styles.Container}>
      <div className={Styles.Title}>
        <img src={image} alt="" />
        <h2>{title}</h2>
      </div>
      <div className={Styles.Items}>
        {items.map(item => (
          <Engagement {...item} />
        ))}
      </div>
    </section>
  );
};

export default Engagements;
