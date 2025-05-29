function Preloader({ text }) {
  return (
    <section className="preloader">
      <div className="preloader__spinner-container">
        <div className="preloader__spinner"></div>
        <div className="preloader__spinner-mask"></div>
      </div>
      <h2 className="preloader__text">{text}</h2>
    </section>
  );
}
export default Preloader;
