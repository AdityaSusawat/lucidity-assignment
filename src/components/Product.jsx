import { useState } from "react";
import Modal from "./Modal.jsx";

export default function Product({
  product,
  isUser,
  products,
  setProducts,
  updateProduct,
}) {
  const { name, category, value, quantity, price, id, disabled } = product;

  const [showModal, setShowModal] = useState(false);

  // For updating feature of button A
  const [editProduct, setEditProduct] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    value: "",
  });

  //For delete feature of button C
  const handleDelete = (id) => {
    const newProducts = products.filter((product) => product.id !== id);
    setProducts(newProducts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    //Updating the currently changed field
    let newEditProduct = { ...editProduct, [name]: value };
    //setEditProduct((prev) => ({ ...prev, [name]: value }));

    //was price or quantity changed?
    if (name === "price" || name === "quantity") {
      //! Not parsing here anymore
      const newPrice = newEditProduct.price;
      const newQuantity = newEditProduct.quantity;

      //Type check just in case
      if (!isNaN(newPrice) && !isNaN(newQuantity)) {
        const newValue = newPrice * newQuantity;
        newEditProduct = { ...newEditProduct, value: newValue };
      }
    }

    setEditProduct(newEditProduct);
  };

  //For submit button of the form
  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = Object.keys(editProduct).reduce((acc, key) => {
      if (editProduct[key] !== "") {
        acc[key] = editProduct[key];
      }
      return acc;
    }, {});

    const updatedProduct = { ...product, ...updates };
    updateProduct(updatedProduct);
    setShowModal(false);
  };

  //For disable feature of button B
  const handleDisable = (id) => {
    setProducts((products) =>
      products.map((product) =>
        product.id === id
          ? { ...product, disabled: !product.disabled }
          : product
      )
    );
  };

  return (
    <>
      <div
        className={`grid grid-cols-inventoryStats px-6 py-2 items-center border-b-[1px] border-[#2F3033] ${
          disabled ? "text-gray-500" : "text-white"
        }`}
      >
        <div>
          <span>{name}</span>
        </div>
        <div>
          <span>{category}</span>
        </div>
        <div>
          <span>{`$ ${price}`}</span>
        </div>
        <div>
          <span>{quantity}</span>
        </div>
        <div>
          <span>{`$ ${value}`}</span>
        </div>
        <div className="flex gap-x-3">
          <button
            className="border-2 p-1 bg-[#272826] text-[#DEFF55] border-[#323332] disabled:text-[#DEFF55]/50"
            disabled={isUser || disabled}
            onClick={() => {
              setEditProduct({
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
                value: product.value,
              });
              setShowModal(true);
            }}
          >
            A
          </button>
          <button
            className="border-2 p-1 bg-[#272826] text-[#DEFF55] border-[#323332] disabled:text-[#DEFF55]/50"
            disabled={isUser}
            onClick={() => handleDisable(id)}
          >
            B
          </button>
          <button
            className="border-2 p-1 bg-[#272826] text-[#DEFF55] border-[#323332] disabled:text-[#DEFF55]/50"
            disabled={isUser}
            onClick={() => handleDelete(product.id)}
          >
            C
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h1 className="text-4xl">Edit product</h1>
        <h2 className="text-2xl">{name}</h2>
        <form
          className="bg-[#292B27] mt-8 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-2 text-xl">
              <label>Category</label>
              <input
                className="text-[#999A98] bg-[#3F413D] rounded-xl px-3 py-2 justify-center items-center"
                name="category"
                value={editProduct.category}
                onChange={handleInputChange}
                placeholder={category}
              />
            </div>
            <div className="flex flex-col gap-y-2 text-xl">
              <label>Price</label>
              <input
                className="text-[#999A98] bg-[#3F413D] rounded-xl px-3 py-2 justify-center items-center"
                name="price"
                value={editProduct.price}
                onChange={handleInputChange}
                placeholder={price}
              />
            </div>
            <div className="flex flex-col gap-y-2 text-xl">
              <label>Quantity</label>
              <input
                className="text-[#999A98] bg-[#3F413D] rounded-xl px-3 py-2 justify-center items-center"
                name="quantity"
                value={editProduct.quantity}
                onChange={handleInputChange}
                placeholder={quantity}
              />
            </div>
            <div className="flex flex-col gap-y-2 text-xl">
              <label>Value</label>
              <input
                className="text-[#999A98] bg-[#3F413D] rounded-xl px-3 py-2 justify-center items-center"
                name="value"
                value={editProduct.value}
                onChange={handleInputChange}
                placeholder={value}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-x-4">
            <button
              className="text-[#DEFF55] p-2 "
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              className="bg-[#272826] text-[#DEFF55] py-2 px-4 border-[3px] rounded-xl border-[#323332]"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
