"use client";

import AdminProtection
from "../../components/AdminProtection";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  useRouter,
} from "next/navigation";

export default function AdminPage() {

  const router =
    useRouter();

  const emptyForm = {

    name: "",
    description: "",
    price: "",
    oldPrice: "",
    image: "",
    category: "",
    notesTags: "",
    badge: "",
    tag: "",
    rating: "",
    reviews: "",
    stock: "",

  };

  const [form,
    setForm] =
    useState(emptyForm);

  const [products,
    setProducts] =
    useState([]);

  const [editingId,
    setEditingId] =
    useState(null);

  const [uploading,
    setUploading] =
    useState(false);

  /* FETCH PRODUCTS */
  async function fetchProducts() {

    try {

      const res =
        await fetch(
          "/api/products"
        );

      const data =
        await res.json();

      if (data.success) {

        setProducts(
          data.products
        );

      }

    } catch (error) {

      console.log(error);

    }

  }

  useEffect(() => {

    fetchProducts();

  }, []);

  /* IMAGE UPLOAD */
  async function handleImageUpload(
    e
  ) {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const res =
        await fetch(

          "/api/upload",

          {

            method: "POST",

            body: formData,

          }

        );

      const data =
        await res.json();

      if (data.success) {

        setForm((prev) => ({

          ...prev,

          image:
            data.imageUrl,

        }));

      }

    } catch (error) {

      console.log(error);

    } finally {

      setUploading(false);

    }

  }

  /* HANDLE CHANGE */
  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  }

  /* SUBMIT */
  async function handleSubmit(
    e
  ) {

    e.preventDefault();

    try {

      const payload = {

        ...form,

        price:
          Number(form.price),

        oldPrice:
          Number(form.oldPrice),

        rating:
          Number(form.rating),

        reviews:
          Number(form.reviews),

        stock:
          Number(form.stock),

        notesTags:
          form.notesTags
            .split(",")
            .map((tag) =>
              tag.trim()
            ),

      };

      let res;

      if (editingId) {

        res = await fetch(

          `/api/products/${editingId}`,

          {

            method: "PATCH",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify(
              payload
            ),

          }

        );

      } else {

        res = await fetch(

          "/api/products",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify(
              payload
            ),

          }

        );

      }

      const data =
        await res.json();

      if (data.success) {

        alert(

          editingId
            ? "Product Updated"
            : "Product Added"

        );

        setForm(emptyForm);

        setEditingId(null);

        fetchProducts();

      }

    } catch (error) {

      console.log(error);

    }

  }

  /* DELETE */
  async function deleteProduct(
    id
  ) {

    const confirmDelete =
      confirm(
        "Delete this product?"
      );

    if (!confirmDelete)
      return;

    try {

      const res =
        await fetch(

          `/api/products/${id}`,

          {

            method: "DELETE",

          }

        );

      const data =
        await res.json();

      if (data.success) {

        fetchProducts();

      }

    } catch (error) {

      console.log(error);

    }

  }

  /* EDIT */
  function editProduct(
    product
  ) {

    setEditingId(
      product._id
    );

    setForm({

      ...product,

      notesTags:
        product.notesTags.join(
          ", "
        ),

    });

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  }

  return (

    <AdminProtection>

      <div className="min-h-screen bg-black text-white px-4 py-10">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-4">

                ANAMYST ADMIN

              </p>

              <h1 className="text-5xl font-bold text-white mb-4">

                Admin Panel

              </h1>

              <p className="text-gray-400 text-lg">

                Manage ANAMYST Products

              </p>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 flex-wrap">

              {/* VIEW ORDERS */}
              <button

                onClick={() => {

                  router.push(
                    "/admin/orders"
                  );

                }}

                className="bg-[#D4AF37] hover:opacity-90 text-black px-6 py-3 rounded-2xl font-semibold transition"

              >

                View Orders

              </button>

              {/* LOGOUT */}
              <button

                onClick={() => {

                  document.cookie =

                    "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                  router.push(
                    "/admin-login"
                  );

                }}

                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition"

              >

                Logout

              </button>

            </div>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-[#D4AF37]/20 rounded-[32px] backdrop-blur-xl p-6 md:p-8 mb-12"
          >

            <div className="grid md:grid-cols-2 gap-5">

              {/* NAME */}
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
                required
              />

              {/* IMAGE */}
              <div className="space-y-3">

                <label className="text-white font-semibold">

                  Product Image

                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="w-full border border-white/10 bg-black/40 text-white rounded-2xl px-5 py-4 outline-none"
                />

                {uploading && (

                  <p className="text-[#D4AF37]">

                    Uploading image...

                  </p>

                )}

                {form.image && (

                  <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-black/30">

                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={form.image}
                      alt="Preview"
                      className="object-contain"
                      loading="lazy"
                    />

                  </div>

                )}

              </div>

              {/* PRICE */}
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
                required
              />

              {/* OLD PRICE */}
              <input
                type="number"
                name="oldPrice"
                placeholder="Old Price"
                value={form.oldPrice}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* CATEGORY */}
              <div>

                <label className="block text-white font-semibold mb-3">

                  Product Category

                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-white/10 bg-black/40 text-white rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Perfumes">
                    Perfumes
                  </option>

                  <option value="Attars">
                    Attars
                  </option>

                  <option value="Fresheners">
                    Fresheners
                  </option>

                  <option value="Premium Gifts">
                    Premium Gifts
                  </option>

                  <option value="Combos">
                    Combos
                  </option>

                </select>

              </div>

              {/* NOTES */}
              <input
                type="text"
                name="notesTags"
                placeholder="Woody, Oud, Luxury"
                value={form.notesTags}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* BADGE */}
              <input
                type="text"
                name="badge"
                placeholder="Premium / Luxury"
                value={form.badge}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* TAG */}
              <input
                type="text"
                name="tag"
                placeholder="Trending / Bestseller"
                value={form.tag}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* RATING */}
              <input
                type="number"
                step="0.1"
                name="rating"
                placeholder="Rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* REVIEWS */}
              <input
                type="number"
                name="reviews"
                placeholder="Reviews"
                value={form.reviews}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* STOCK */}
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

            </div>

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none mt-5 focus:border-[#D4AF37]"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={uploading}
              className="mt-6 bg-[#D4AF37] text-black px-8 py-4 rounded-2xl hover:opacity-90 transition duration-300 font-semibold disabled:opacity-50"
            >

              {uploading
                ? "Uploading..."
                : editingId
                ? "Update Product"
                : "Add Product"}

            </button>

          </form>

          {/* PRODUCTS */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {products.map(
              (product) => (

                <div
                  key={product._id}
                  className="bg-white/5 border border-[#D4AF37]/20 rounded-[32px] overflow-hidden backdrop-blur-xl"
                >

                  <div className="relative h-[320px] bg-black/30">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-5"
                    />

                  </div>

                  <div className="p-6">

                    <h2 className="text-2xl font-bold text-white">

                      {product.name}

                    </h2>

                    <p className="text-gray-400 mt-2 line-clamp-2">

                      {product.description}

                    </p>

                    <div className="mt-5 flex items-center justify-between">

                      <div>

                        <p className="text-3xl font-bold text-[#D4AF37]">

                          ₹{product.price}

                        </p>

                        <p className="text-green-400 font-semibold mt-1">

                          Stock:
                          {" "}
                          {product.stock}

                        </p>

                      </div>

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            editProduct(
                              product
                            )
                          }
                          className="bg-[#D4AF37] text-black px-5 py-2 rounded-xl hover:opacity-90 transition font-semibold"
                        >

                          Edit

                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(
                              product._id
                            )
                          }
                          className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </AdminProtection>

  );

}