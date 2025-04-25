import ghIconSrc from "../images/github.svg";
import fbIconSrc from "../images/facebook.svg";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">
        &copy; 2024 Supersite, Powered by News API
      </p>
      <ul className="footer__links-list links">
        <li className="links__item">
          <a className="links__link" href="/">
            Home
          </a>
        </li>
        <li className="links__item">
          <a className="links__link" href="https://tripleten.com">
            TripleTen
          </a>
        </li>
        <li className="links__item">
          <a className="links__link" href="https://github.com/ilyalyudevig">
            <img src={ghIconSrc} />
          </a>
        </li>
        <li className="links__item">
          <a
            className="links__link"
            href="https://www.facebook.com/ilya.lyudevig"
          >
            <img src={fbIconSrc} />
          </a>
        </li>
      </ul>
    </footer>
  );
}
export default Footer;
