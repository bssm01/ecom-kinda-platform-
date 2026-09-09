import { useEffect, useState } from "react";
import "./Others.css";
import { Link } from "react-router-dom";

function Others() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/all");
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(Array.isArray(data.Product) ? data.Product : []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  if (loading) {
    return (
      <main className="Others others-state">
        <p>Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="Others others-state">
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="Others">
      <section className="others-content">
        <div className="others-heading">
          <p className="products-eyebrow">COMMUNITY COLLECTION</p>
          <h1>Discover other products</h1>
          <p>Browse products shared by the Hanoutek community.</p>
        </div>

        <div className="others-search">
          <label htmlFor="product-search">Search by product name</label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
          />
        </div>

        {visibleProducts.length === 0 ? (
          <div className="others-empty">
            <h2>{search ? "No matching products" : "No products yet"}</h2>
            <p>
              {search
                ? "Try another product name."
                : "Products shared by other users will appear here."}
            </p>
          </div>
        ) : (
          <ul className="product-grid">
            {visibleProducts.map((product) => (
              <li className="product-card" key={product._id}>
                <Link
                  className="product-card-link"
                  to={`/product/${product._id}`}
                >
                  {product.image ? (
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="product-image product-image-placeholder">
                      H
                    </div>
                  )}
                  <div className="product-details">
                    <h2>{product.name}</h2>
                    <p className="product-owner">
                      By {product.userId?.username || "Hanoutek user"}
                    </p>
                    <p className="product-quantity">
                      {product.quantity} available
                    </p>
                    <p className="product-price">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Others;
