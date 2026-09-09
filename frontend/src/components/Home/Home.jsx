import "./Home.css";
import { useAuth } from "../../authContext.jsx";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useAuth();
  return (
    <div className="Home">
      <div className="home-content">
        <div className="text">
          <p className="home-eyebrow">HANOUTEK STORE</p>
          <h1>Welcome {user ? user.username : "Guest"}</h1>
          <p>Discover the best products at unbeatable prices.</p>
        </div>
        <div className="home-actions">
          <Link to="/products">Browse products</Link>
        </div>
      </div>
      <article className="home-article">
        <section className="home-article-section">
          <p className="home-eyebrow">OUR STORE</p>
          <h2>A simpler way to manage your products</h2>
          <p>
            Hanoutek is a friendly product management store built to keep your
            collection organized. Sign in to view your products, add new items,
            and keep important details such as prices, quantities, and images in
            one clear place.
          </p>
        </section>
        <section className="home-article-section">
          <p className="home-eyebrow">BUILT WITH</p>
          <h2>The technology behind Hanoutek</h2>
          <ul className="tech-stack">
            <li>
              <strong>React</strong>
              <span>Interactive frontend experience</span>
            </li>
            <li>
              <strong>React Router</strong>
              <span>Fast page navigation</span>
            </li>
            <li>
              <strong>Node.js & Express</strong>
              <span>Backend API and routes</span>
            </li>
            <li>
              <strong>MongoDB & Mongoose</strong>
              <span>Product and user data</span>
            </li>
            <li>
              <strong>JWT</strong>
              <span>Secure user authentication</span>
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}

export default Home;
