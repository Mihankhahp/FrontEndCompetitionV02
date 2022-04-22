import React, { useEffect, useReducer } from "react";
import { fetchData } from "./Components/Api/Api";
// import Products from "./Components/Products/Products";
import Navbar from "./Components/Navbar/Navbar"
import { INITIALSTATE, reducer } from "./ActionCenter/Reducer";
import { setIsLoading, setProducts, setFetchOffset, setSearchKeyWord, setUniueProducts } from "./ActionCenter/Action";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Product from "./Components/Products/Product/Product";
import Loading from "./Components/Loading/Loading";



function App() {

  const [{ fetchingOffset, isLoading, products, uniqueProducts, searchKeyWord }, dispatch] = useReducer(reducer, INITIALSTATE)
  console.log("offset Value", fetchingOffset);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop > (document.documentElement.offsetHeight) / 2 || isLoading) return;
      dispatch(setIsLoading(true));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const getUniqueListBy = async (arr, key) => {
    const uniqueProducts = await [...new Map(arr.map(item => [item[key], item])).values()]
    dispatch(setUniueProducts(uniqueProducts))
  }
  useEffect(() => {
    getUniqueListBy(products, "name")
  }, [products]);

  useEffect(() => {
    if (!isLoading) return;
    else {
      setTimeout(() => {
        const newFetchOffset = fetchingOffset + 20
        fetchData(newFetchOffset).then((data) => {
          dispatch(setProducts(data))
          dispatch(setFetchOffset(newFetchOffset))
          dispatch(setIsLoading(false))
        }, 2000);
      })
    }
  }, [isLoading, fetchingOffset, searchKeyWord]);

  const filteredProducts = searchKeyWord && uniqueProducts.filter(
    (product) => {
      return product.description.toLowerCase().includes(searchKeyWord.toLowerCase())
    }
  )
  return (
    <>
      <Navbar sendVal={(inpval) => dispatch(setSearchKeyWord(inpval))} searchKey={searchKeyWord} />
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 500: 2, 900: 3, 1200: 4, 1400: 5, 1600: 6 }}>
        <Masonry gutter="10px">
          {products && searchKeyWord ? filteredProducts.map((product, index) => (
            <Product product={product} key={index} />
          )) : uniqueProducts.map((product, index) => (
            <Product product={product} key={index} />
          ))
          }
        </Masonry>
      </ResponsiveMasonry>
      {Loading && <Loading />}

    </>
  );
}
export default App;



  // const getUniqueListBy = async (arr, key) => {
  //   const newProducts = await [...new Map(arr.map(item => [item[key], item])).values()]

  //   console.log("",newProducts);
  // }

  // useEffect(() => {
  //   getUniqueListBy(products, "image_url")
  // }, [products]);