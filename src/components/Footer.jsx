import ghIconSrc from "../images/github.svg";
import fbIconSrc from "../images/facebook.svg";
import { Link } from "react-router-dom";

function Footer() {
  const date = new Date();

  return (
    <footer className="footer">
      <p className="footer__copyright">
        &copy; {`${date.getFullYear()}`} Supersite, Powered by News API
      </p>
      <div className="footer__links-container">
        <ul className="footer__links-list links links--main">
          <li className="links__item">
            <Link to="/" className="links__link">
              Home
            </Link>
          </li>
          <li className="links__item">
            <a
              className="links__link"
              href="https://tripleten.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TripleTen
            </a>
          </li>
        </ul>
        <ul className="footer__links-list links links--social">
          <li className="links__item">
            <a
              className="links__link"
              href="https://github.com/ilyalyudevig"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={ghIconSrc} />
            </a>
          </li>
          <li className="links__item">
            <a
              className="links__link"
              href="https://www.facebook.com/ilya.lyudevig"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={fbIconSrc} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
export default Footer;
