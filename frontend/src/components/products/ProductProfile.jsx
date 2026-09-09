import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../authContext.jsx";
import EditProductModal from "../others/EditProductModal.jsx";
import "./ProductProfile.css";

function ProductProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/public/${id}`,
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }
        setProduct(data.Product);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const ownerId = product?.userId?._id || product?.userId;
  const canManage = Boolean(
    ownerId && user?._id && ownerId.toString() === user._id.toString(),
  );

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }
    setActionError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/deleteProduct/${product._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "You cannot delete this product");
      }
      navigate("/others");
    } catch (deleteError) {
      setActionError(deleteError.message);
    }
  };

  const handleUpdate = (updatedProduct) => {
    setProduct(updatedProduct);
    setEditing(false);
    setActionError("");
  };

  if (loading) {
    return (
      <main className="ProductProfile profile-state">Loading product...</main>
    );
  }

  if (error || !product) {
    return (
      <main className="ProductProfile profile-state">
        <p>{error || "Product not found"}</p>
        <Link to="/others">Back to products</Link>
      </main>
    );
  }

  return (
    <main className="ProductProfile">
      <article className="profile-card">
        <Link className="profile-back" to="/others">
          Back to products
        </Link>
        {product.image ? (
          <img
            className="profile-image"
            src={product.image}
            alt={product.name}
          />
        ) : (
          <div className="profile-image profile-image-placeholder">H</div>
        )}
        <div className="profile-details">
          <p className="products-eyebrow">PRODUCT PROFILE</p>
          <h1>{product.name}</h1>
          <p className="profile-owner">
            By {product.userId?.username || "Hanoutek user"}
          </p>
          {actionError && <p className="profile-action-error">{actionError}</p>}
          <div className="profile-meta">
            <div>
              <span>Price</span>
              <strong>${Number(product.price).toFixed(2)}</strong>
            </div>
            <div>
              <span>Available</span>
              <strong>{product.quantity}</strong>
            </div>
          </div>
          {canManage && (
            <div className="profile-actions">
              <button type="button" onClick={() => setEditing(true)}>
                Update
              </button>
              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </article>
      {editing && (
        <EditProductModal
          product={product}
          onClose={() => setEditing(false)}
          onUpdated={handleUpdate}
        />
      )}
    </main>
  );
}

export default ProductProfile;
