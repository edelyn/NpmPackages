import { useStateLoader } from "@nait-aits/fetch-state";
import { useEffect } from "react";

type Product = { name: string; id: number };
export function SamplePage() {
  //note: setProducts is shown here for demonstration purposes only.
  var [products, loadProducts, setProducts] = useStateLoader<Product[]>({
    url: `Products/GetAllProducts`,
    method: "GET",
    data: {
      prop1: "Test",
    },
  });

  useEffect(() => {
    //by returning the cancellation function, this will
    //be automatically aborted when you leave this control
    return loadProducts();
  }, []);

  return (
    <div>
      {products.loading && <div>Loading...</div>}
      {products.error && <div>Error: {products.error?.message}</div>}
      {products.data && (
        <div>
          <div>
            {products.data.map((product) => (
              <div key={product.id}>{product.name}</div>
            ))}
          </div>
          <div>
            <button
              onClick={() => {
                loadProducts({
                  data: {
                    prop1: "Test2",
                  },
                });
              }}
            >
              Reload with Different Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
