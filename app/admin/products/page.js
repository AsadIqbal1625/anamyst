"use client";
import AdminProtection from "@/components/AdminProtection";
import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import { compressImage } from "@/lib/compressImage";

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
      costPrice: "",
      image: "",
      images: [],
      category: "",
      genderCategory: "",
      notesTags: "",

      topNotes: "",
      heartNotes: "",
      baseNotes: "",

      longevity: "",
      projection: "",
      occasion: "",
      season: "",

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

  /* INVENTORY EXPORT DATE RANGE (defaults to current month) */
  function toDateInput(date) {
    return date.toISOString().slice(0, 10);
  }

  const today = new Date();

  const [exportFrom, setExportFrom] = useState(
    toDateInput(new Date(today.getFullYear(), today.getMonth(), 1))
  );

  const [exportTo, setExportTo] = useState(
    toDateInput(new Date(today.getFullYear(), today.getMonth() + 1, 0))
  );

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

  /* IMAGE UPLOAD (multiple) */
  async function handleImageUpload(
    e
  ) {

    const files =
      Array.from(e.target.files || []);

    if (!files.length) return;

    try {

      setUploading(true);

      const uploadedUrls = [];

      for (const file of files) {

        const compressed =
          await compressImage(file);

        const formData =
          new FormData();

        formData.append(
          "file",
          compressed
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

          uploadedUrls.push(
            data.imageUrl
          );

        }

      }

      setForm((prev) => {

        const images = [
          ...prev.images,
          ...uploadedUrls,
        ];

        return {

          ...prev,

          images,

          image:
            prev.image ||
            images[0] ||
            "",

        };

      });

    } catch (error) {

      console.log(error);

    } finally {

      setUploading(false);

      e.target.value = "";

    }

  }

  /* REMOVE IMAGE FROM GALLERY */
  function removeImage(index) {

    setForm((prev) => {

      const images =
        prev.images.filter(
          (_, i) => i !== index
        );

      return {

        ...prev,

        images,

        image:
          images[0] || "",

      };

    });

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

        costPrice:
          Number(form.costPrice) || 0,

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

      images:
        product.images?.length
          ? product.images
          : product.image
          ? [product.image]
          : [],

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

      <div className="text-white">

        <div>

          {/* HEADER */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <p className="text-gray-400">

              Manage ANAMYST products and inventory.

            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 flex-wrap items-end">

              {/* INVENTORY EXPORT DATE RANGE */}
              <div className="flex gap-3 items-end bg-white/5 border border-white/10 rounded-2xl px-4 py-3">

                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    Sales From
                  </label>
                  <input
                    type="date"
                    value={exportFrom}
                    onChange={(e) => setExportFrom(e.target.value)}
                    className="bg-black/40 border border-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    Sales To
                  </label>
                  <input
                    type="date"
                    value={exportTo}
                    onChange={(e) => setExportTo(e.target.value)}
                    className="bg-black/40 border border-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <a
                  href={`/api/inventory/export?from=${exportFrom}&to=${exportTo}`}
                  className="bg-white/10 border border-[#D4AF37]/40 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold transition whitespace-nowrap"
                >
                  Download Inventory (Excel)
                </a>

              </div>

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

                onClick={async () => {

                  await fetch(
                    "/api/admin/logout",
                    { method: "POST" }
                  ).catch(() => {});

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

              {/* IMAGES */}
              <div className="space-y-3">

                <label className="text-white font-semibold">

                  Product Images (first = cover)

                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleImageUpload
                  }
                  className="w-full border border-white/10 bg-black/40 text-white rounded-2xl px-5 py-4 outline-none"
                />

                {uploading && (

                  <p className="text-[#D4AF37]">

                    Uploading image(s)...

                  </p>

                )}

                {form.images.length > 0 && (

                  <div className="grid grid-cols-3 gap-3">

                    {form.images.map(
                      (img, index) => (

                        <div
                          key={img + index}
                          className="relative h-[100px] rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-black/30"
                        >

                          <Image
                            fill
                            sizes="150px"
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="object-contain"
                            loading="lazy"
                          />

                          {index === 0 && (

                            <span className="absolute bottom-1 left-1 bg-[#D4AF37] text-black text-[10px] font-semibold px-2 py-0.5 rounded-full">

                              Cover

                            </span>

                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(index)
                            }
                            className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full text-xs hover:bg-red-500 transition"
                          >

                            ×

                          </button>

                        </div>

                      )
                    )}

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

              {/* COST PRICE */}
              <input
                type="number"
                name="costPrice"
                placeholder="Cost Price (for profit reports)"
                value={form.costPrice}
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

              {/* GENDER CATEGORY */}
            <div>

              <label className="block text-white font-semibold mb-3">

                Gender Category

              </label>

              <select
                name="genderCategory"
                value={form.genderCategory}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
                required
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Men">
                  Men
                </option>

                <option value="Women">
                  Women
                </option>

                <option value="Unisex">
                  Unisex
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
              {/* TOP NOTES */}
              <input
                type="text"
                name="topNotes"
                placeholder="Top Notes (Bergamot, Lemon)"
                value={form.topNotes}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* HEART NOTES */}
              <input
                type="text"
                name="heartNotes"
                placeholder="Heart Notes (Rose, Jasmine)"
                value={form.heartNotes}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* BASE NOTES */}
              <input
                type="text"
                name="baseNotes"
                placeholder="Base Notes (Oud, Amber, Musk)"
                value={form.baseNotes}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* LONGEVITY */}
              <input
                type="text"
                name="longevity"
                placeholder="Longevity (8-10 Hours)"
                value={form.longevity}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* PROJECTION */}
              <input
                type="text"
                name="projection"
                placeholder="Projection (Strong)"
                value={form.projection}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* OCCASION */}
              <input
                type="text"
                name="occasion"
                placeholder="Occasion (Date Night, Office)"
                value={form.occasion}
                onChange={handleChange}
                className="w-full border border-white/10 bg-black/40 text-white placeholder:text-gray-400 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37]"
              />

              {/* SEASON */}
              <input
                type="text"
                name="season"
                placeholder="Season (Winter, Summer, All Season)"
                value={form.season}
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

  )

}