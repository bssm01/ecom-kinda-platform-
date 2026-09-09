import { useState } from "react";

function EditProductModal({ product, onClose, onUpdated }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [image, setImage] = useState(product.image || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const productData = {
        name,
        price: Number(price),
        quantity: Number(quantity),
      };
      if (image.trim()) {
        productData.image = image.trim();
      }

      const response = await fetch(
        `http://localhost:5000/api/products/updateProduct/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(productData),
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }
      onUpdated(data.updatedProduct);
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Update product</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-price">Price</label>
            <input
              id="edit-price"
              type="number"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-quantity">Quantity</label>
            <input
              id="edit-quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-image">Image URL (optional)</label>
            <input
              id="edit-image"
              value={image}
              onChange={(event) => setImage(event.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
