import avatar from "../images/avatar.avif";

function About() {
  return (
    <section className="about" aria-label="About the author">
      <div className="about__avatar-container">
        <img className="about__avatar" src={avatar} alt="Author's avatar" />
      </div>
      <div className="about__content">
        <h2 className="about__title">About the author</h2>
        <p className="about__paragraph">
          This block describes the project author. Here you should indicate your
          name, what you do, and which development technologies you know.
          <br /> <br />
          You can also talk about your experience with TripleTen, what you
          learned there, and how you can help potential customers.
        </p>
      </div>
    </section>
  );
}
export default About;
