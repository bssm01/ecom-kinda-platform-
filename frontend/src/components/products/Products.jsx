import "./Products.css";
import { useAuth } from "../../authContext.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddProductModal from "./AddProductsModal.jsx";

function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/products/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const responseData = await response.json().catch(() => ({}));
          throw new Error(
            responseData.message ||
              `Failed to fetch products (${response.status})`,
          );
        }
        const data = await response.json();
        setProducts(Array.isArray(data.Product) ? data.Product : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowModal(false);
  };

  if (!user) {
    return (
      <main className="Products products-state">
        <section className="login-products-prompt">
          <p className="products-eyebrow">HANOUTEK COLLECTION</p>
          <h1>Log in to see your products</h1>
          <p>Your products will be waiting for you once you sign in.</p>
          <Link className="products-login-button" to="/login">
            Go to login
          </Link>
        </section>
      </main>
    );
  }
  if (loading) {
    return (
      <main className="Products products-state">
        <p>Loading products...</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="Products products-state">
        <p>Error: {error}</p>
      </main>
    );
  }
  return (
    <main className="Products">
      <section className="products-content">
        <div className="products-heading">
          <p className="products-eyebrow">HANOUTEK COLLECTION</p>
          <h1>Hello {user?.username || "Guest"}</h1>
          <p>Explore the products available in your garage :</p>
        </div>
        <div className="products-actions">
          <button type="button" onClick={() => setShowModal(true)}>
            <span aria-hidden="true">+</span> Add product
          </button>
        </div>
        {products.length === 0 ? (
          <div className="empty-products">
            <h2>No products yet</h2>
            <p>Your collection will appear here once products are added.</p>
          </div>
        ) : (
          <ul className="product-grid">
            {products.map((p) => (
              <li className="product-card" key={p._id}>
                <Link className="product-card-link" to={`/product/${p._id}`}>
                  {p.image ? (
                    <img className="product-image" src={p.image} alt={p.name} />
                  ) : (
                    <div className="product-image product-image-placeholder">
                      H
                    </div>
                  )}
                  <div className="product-details">
                    <h2>{p.name}</h2>
                    <p className="product-quantity">{p.quantity} available</p>
                    <p className="product-price">
                      ${Number(p.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdded={handleAddProduct}
        />
      )}
    </main>
  );
}

export default Products;
