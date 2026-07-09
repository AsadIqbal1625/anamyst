"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { compressImage } from "@/lib/compressImage";

const emptyForm = {
  name: "",
  location: "",
  quote: "",
  rating: 5,
  image: "",
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchTestimonials() {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage("");

      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.imageUrl }));
      } else {
        setMessage(data.error || "Image upload failed — try again before submitting");
      }
    } catch (err) {
      setMessage("Image upload failed — try again before submitting");
    } finally {
      setUploading(false);
    }
  }

  async function createTestimonial(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setForm(emptyForm);
        setMessage("Testimonial added ✅");
        fetchTestimonials();
      } else {
        setMessage(data.error || "Failed to add testimonial");
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(testimonial) {
    await fetch(`/api/testimonials/${testimonial._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !testimonial.published }),
    });
    fetchTestimonials();
  }

  async function deleteTestimonial(id) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
  }

  return (
    <div className="p-8 text-white space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
        <p className="text-gray-400">
          Manage customer testimonials shown on the homepage.
        </p>
      </div>

      {/* CREATE TESTIMONIAL */}
      <form
        onSubmit={createTestimonial}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-5">Add Testimonial</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Customer name"
            required
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location (optional)"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
            />
            {uploading && (
              <p className="text-[#D4AF37] text-xs">Uploading...</p>
            )}
            {form.image && (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#D4AF37]/30">
                <Image
                  fill
                  sizes="56px"
                  src={form.image}
                  alt="Preview"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="Testimonial text"
            required
            rows={3}
            className="md:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />
        </div>

        <div className="flex items-center gap-5 mt-5">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {uploading ? "Uploading image..." : saving ? "Adding..." : "Add Testimonial"}
          </button>

          {message && <span className="text-sm text-gray-300">{message}</span>}
        </div>
      </form>

      {/* TESTIMONIALS LIST */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-5">All Testimonials</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-gray-400">
            No testimonials yet. Add your first one above.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="border border-white/10 rounded-2xl p-5 flex gap-4"
              >
                {t.image ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/30 shrink-0">
                    <Image fill sizes="48px" src={t.image} alt={t.name} className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{t.name}</p>
                    <span
                      className={
                        t.published ? "text-green-400 text-xs" : "text-red-400 text-xs"
                      }
                    >
                      {t.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  {t.location && (
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  )}

                  <p className="text-[#D4AF37] text-xs mt-1">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </p>

                  <p className="text-gray-300 text-sm mt-2">{t.quote}</p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => togglePublished(t)}
                      className="px-3 py-1.5 rounded-lg border border-white/20 text-xs hover:border-[#D4AF37] transition"
                    >
                      {t.published ? "Hide" : "Publish"}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t._id)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
