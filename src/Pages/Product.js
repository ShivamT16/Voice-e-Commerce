import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./product.css";

import { CartContext, WishListContext, ProductContext } from "..";

import { Loader } from "./Loader";

export function Product({ products, categories }) {
  const { handleCartUpdate, cartNotify, deleteNotify, cart } = useContext(
    CartContext
  );
  const {
    handleWishListUpdate,
    wishListNotify,
    wishList,
    handleDelete
  } = useContext(WishListContext);
  const { handleProduct } = useContext(ProductContext);

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    sortFilter: "",
    categoryFilter: [],
    ratingFilter: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    Mainfunction();
  }, []);

  const Mainfunction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleClearFilter = () => {
    setFilter({
      sortFilter: "",
      categoryFilter: [],
      ratingFilter: 0
    });
  };

  const sortingHandler = (sortElement) => {
    setFilter({ ...filter, sortFilter: sortElement });
  };

  const checkboxHandler = (categoryElement) => {
    const category = categoryElement.toLowerCase();
    filter.categoryFilter.includes(category)
      ? setFilter({
          ...filter,
          categoryFilter: filter.categoryFilter.filter(
            (categoryFilter) => categoryFilter !== category
          )
        })
      : setFilter({
          ...filter,
          categoryFilter: [...filter.categoryFilter, category]
        });
  };

  const ratingHandler = (ratingElement) => {
    setFilter({ ...filter, ratingFilter: ratingElement });
  };

  const priceFiltered =
    filter.sortFilter.length > 0
      ? [...products].sort((a, b) =>
          filter.sortFilter === "LtoH" ? a.price - b.price : b.price - a.price
        )
      : [...products];

  const categoryFiltered =
    filter.categoryFilter.length > 0
      ? [...priceFiltered].filter(({ category }) =>
          filter.categoryFilter.includes(category)
        )
      : [...priceFiltered];

  const ratingFiltered =
    filter.ratingFilter.length > 0
      ? [...categoryFiltered].filter(
          ({ rating }) => rating >= filter.ratingFilter
        )
      : [...categoryFiltered];

  return (
    <div className="filter">
      <div className="filter1">
        <button onClick={() => navigate(-1)}> Back </button>
        <form onReset={handleClearFilter}>
          <button type="reset">Clear Filters</button>
          <p className="filter2">
            <strong>Price </strong>
          </p>
          <p className="filter2">
            <input
              type="radio"
              name="price"
              value="LtoH"
              onChange={(e) => sortingHandler(e.target.value)}
            />
            Low to High
          </p>
          <p className="filter2">
            <input
              type="radio"
              name="price"
              value="HtoL"
              checked={filter.sortFilter === "" ? false : null}
              onChange={(e) => sortingHandler(e.target.value)}
            />
            High to Low
          </p>
          <p className="filter2">
            <strong>Category</strong>
          </p>
          {categories.map(({ _id, category }) => (
            <div className="filter3" key={_id}>
              <input
                type="checkbox"
                value={category}
                name="category"
                onChange={(e) => checkboxHandler(e.target.value)}
                checked={filter.category === "" ? false : null}
              />
              {category}
            </div>
          ))}

          <p className="filter2">
            <strong>Rating </strong>
          </p>
          <p>
            1
            <input
              type="range"
              min="1"
              max="5"
              onChange={(e) => ratingHandler(e.target.value)}
            />
            5
          </p>
        </form>
      </div>

      {loading && <Loader />}

      <div className="product">
        {ratingFiltered.map((item) => {
          const { id, name, price, image, rating } = item;
          return (
            <div
              key={id}
              className="product1"
              onClick={() => handleProduct(id)}
            >
              <Link className="link" to="/productDetail">
                <img alt="product img" src={image} />
                <ul>{name}</ul>
                <p>
                  INR:{price} {rating}
                </p>
              </Link>
              {cart.find((element) => element.id == item.id) ? (
                <NavLink to="/cart">
                  <button> Go to Cart</button>
                </NavLink>
              ) : (
                <button
                  onClick={() => {
                    handleCartUpdate(item);
                    cartNotify();
                  }}
                >
                  Add to Cart
                </button>
              )}
              {wishList.find((element) => element.id == item.id) ? (
                <button
                  onClick={() => {
                    handleDelete(id);
                    deleteNotify();
                  }}
                >
                  Remove from Favourite
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleWishListUpdate(item);
                    wishListNotify();
                  }}
                >
                  Add to Favourite
                </button>
              )}

              <ToastContainer autoClose={2000} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
