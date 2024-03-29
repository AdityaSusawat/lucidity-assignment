import { useEffect, useState } from "react";
import Product from "./components/Product";
import StatCard from "./components/StatCard";

//value property in the API is redundant

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handles the toggle between admin and user
  const [isUser, setIsUser] = useState(false);

  //State to store all the stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    outOfStocks: 0,
    numberOfCategory: 0,
  });

  //Tried Handling 429s
  const [hasFetched, setHasFetched] = useState(false);

  //For admin-user checkbox toggle
  const handleToggle = () => {
    setIsUser(!isUser);
  };

  // To update a single products
  const updateProduct = (updatedProduct) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  //Fetching products; Also tried workarounds for error 429 (Too many requests)
  useEffect(() => {
    console.log("useEffect to fetch products");
    const fetchProducts = async () => {
      if (hasFetched) {
        console.log("using cached products");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          "https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const dataWithID = data.map((item) => ({
          ...item,
          //! parsing during the fetch
          value: parseFloat(item.value.replace("$", "")),
          price: parseFloat(item.price.replace("$", "")),
          id: Math.floor(Math.random() * 10000),
          disabled: false, // To enable feature B
        }));
        setProducts(dataWithID);
        setHasFetched(true);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [hasFetched]);

  //Find product stats
  useEffect(() => {
    console.log("useEffect to find product stats");
    const handleStats = (products) => {
      if (!products) {
        return;
      }

      const activeProducts = products.filter((product) => !product.disabled);
      console.log(activeProducts);
      const totalProducts = activeProducts.length;
      const totalValue = activeProducts.reduce(
        (acc, curr) => acc + curr.value, //!Not parsing here anymore
        0
      );
      const outOfStocks = activeProducts.reduce((acc, curr) => {
        if (curr.quantity === 0) {
          return acc + 1;
        }
        return acc;
      }, 0);
      const setOfCategories = new Set(
        activeProducts.map((product) => product.category)
      );
      const numberOfCategory = setOfCategories.size;
      setStats({ totalProducts, totalValue, outOfStocks, numberOfCategory });
    };
    handleStats(products);
  }, [products]);

  //To store data for the statCards
  const statCardData = [
    {
      icon: "null",
      heading: "Total Products",
      value: stats.totalProducts,
    },
    {
      icon: "null",
      heading: "Total store value",
      value: stats.totalValue,
    },
    {
      icon: "null",
      heading: "Out of stocks",
      value: stats.outOfStocks,
    },
    {
      icon: "null",
      heading: "No of categories",
      value: stats.numberOfCategory,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-end gap-10 text-white px-4 py-3">
        <div className="flex gap-2">
          <div>admin</div>
          <label
            htmlFor="toggle"
            className="flex items-center cursor-pointer relative"
          >
            <input
              type="checkbox"
              id="toggle"
              className="sr-only"
              checked={isUser}
              onChange={handleToggle}
            />
            <div
              className={`border-2 transition-all h-6 w-11 rounded-full ${
                isUser ? "bg-green-400" : "bg-gray-200"
              }`}
            ></div>
          </label>
          <div>user</div>
        </div>
        <div>ICON</div>
      </div>

      {/* Rest of the page */}
      <div className="px-4 pt-10">
        <h1 className="text-4xl">Inventory Stats</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-5 my-8 ">
          {statCardData.map((stats, index) => (
            <StatCard key={index} stats={stats} />
          ))}
        </div>

        {/* Products table */}
        <div className="bg-[#212124] border-[1px] border-[#2F3033]">
          {/* 1st row of Inventory stats */}
          <div className="grid grid-cols-inventoryStats px-6 py-3 text-[#C0D461] border-b-[1px] border-[#2F3033]">
            <div>
              <span className="bg-[#161718] rounded-md py-1 px-2">Name</span>
            </div>
            <div>
              <span className="bg-[#161718] rounded-md py-1 px-2">
                Category
              </span>
            </div>
            <div>
              <span className="bg-[#161718] rounded-md py-1 px-2">Price</span>
            </div>
            <div>
              <span className="bg-[#161718] rounded-md py-1 px-2">
                Quantity
              </span>
            </div>
            <div>
              <span className="bg-[#161718] rounded-md py-1 px-2">Value</span>
            </div>
            <div>
              <span className="bg-[#161718] rounded-md py-1 px-2">Action</span>
            </div>
          </div>

          {/* Fetched stats form the API */}
          {/* Is loading? > did we get an error? > products is empty? */}
          <>
            {loading ? (
              <div className="text-6xl p-10 text-center">Loading...</div>
            ) : error ? (
              <div className="text-6xl p-10 text-center">{error}</div>
            ) : products ? (
              products.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  isUser={isUser}
                  products={products}
                  setProducts={setProducts}
                  updateProduct={updateProduct}
                />
              ))
            ) : (
              <div>No products found</div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default App;
