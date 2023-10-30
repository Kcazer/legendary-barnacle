import Styles from './Engagement.module.scss';

type Props = {
  text: string;
  link: string;
  image: string;
  color: string;
}

const Engagement = ({ text, link, image }: Props) => {
  return (
    <a className={Styles.Container} href={link}>
      <img src={image} alt="" />
      <p>{text}</p>
    </a>
  );
};

export default Engagement;
