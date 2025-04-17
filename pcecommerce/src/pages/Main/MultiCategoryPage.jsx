import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompFilter from "../../components/CompFilter";
import Skeleton from "../../components/Skeleton";
import ProductList from "../../components/ProductList";
import { fetchFilteredProducts } from "../../Service/productApi";
import { useSelector } from "react-redux";

function MultiCategoryPage() {
  const { slugs } = useParams(); // slugs = "laptop,mouse"
  const filter = useSelector((state) => state.filter);

  const [allProducts, setAllProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadProducts = async () => {
      setLoading(true);
      const slugList = slugs.split(",");
      const results = {};

      try {
        for (const slug of slugList) {
          const data = await fetchFilteredProducts({
            ...filter,
            category: slug,
          });
          results[slug] = data;
        }

        setAllProducts(results);
      } catch (err) {
        console.error("Lỗi khi tải nhiều danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [slugs, filter]);

  if (loading) {
    return (
      <div
        className="homepage-collection-swiper mx-auto"
        style={{ width: "1220px" }}
      >
        <CompFilter />
        <Skeleton type="product" count={15} />
      </div>
    );
  }

  return (
    <div
      className="homepage-collection-swiper mx-auto"
      style={{ width: "1220px" }}
    >
      <CompFilter />
      {Object.entries(allProducts).map(([slug, products]) => (
        <div key={slug} className="mb-10">
          <h2 className="text-xl font-bold mb-4">{slug.toUpperCase()}</h2>
          {products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <p>Không có sản phẩm nào trong danh mục {slug}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default MultiCategoryPage;
