"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { compressImage } from "@/lib/compressImage";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NoticesAdminPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  async function fetchNotices() {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.success) setNotices(data.notices || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  function handleTitleChange(value) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = editingId
        ? await fetch(`/api/notices/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          })
        : await fetch("/api/notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

      const data = await res.json();

      if (data.success) {
        setForm(emptyForm);
        setEditingId(null);
        setSlugTouched(false);
        setMessage(editingId ? "Notice updated ✅" : "Notice added ✅");
        fetchNotices();
      } else {
        setMessage(data.error || "Failed to save notice");
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function editNotice(notice) {
    setEditingId(notice._id);
    setSlugTouched(true);
    setForm({
      title: notice.title,
      slug: notice.slug,
      excerpt: notice.excerpt || "",
      content: notice.content,
      image: notice.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setSlugTouched(false);
    setForm(emptyForm);
  }

  async function togglePublished(notice) {
    await fetch(`/api/notices/${notice._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !notice.published }),
    });
    fetchNotices();
  }

  async function deleteNotice(id) {
    if (!confirm("Delete this notice?")) return;
    await fetch(`/api/notices/${id}`, { method: "DELETE" });
    fetchNotices();
  }

  return (
    <div className="text-white space-y-10">
      <p className="text-gray-400">
        Post announcements shown on the homepage and /notices.
      </p>

      {/* CREATE / EDIT NOTICE */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-5">
          {editingId ? "Edit Notice" : "Add Notice"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Title"
            required
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm({ ...form, slug: slugify(e.target.value) });
            }}
            placeholder="url-slug"
            required
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <div className="md:col-span-2 space-y-2">
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
              <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-[#D4AF37]/20">
                <Image
                  fill
                  sizes="600px"
                  src={form.image}
                  alt="Preview"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Short excerpt (shown in previews)"
            rows={2}
            className="md:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Full content"
            required
            rows={6}
            className="md:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />
        </div>

        <div className="flex items-center gap-5 mt-5">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {uploading ? "Uploading image..." : saving ? "Saving..." : editingId ? "Update Notice" : "Add Notice"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-3 rounded-xl border border-white/20 hover:border-[#D4AF37] transition"
            >
              Cancel
            </button>
          )}

          {message && <span className="text-sm text-gray-300">{message}</span>}
        </div>
      </form>

      {/* NOTICES LIST */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-5">All Notices</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : notices.length === 0 ? (
          <p className="text-gray-400">
            No notices yet. Add your first one above.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {notices.map((n) => (
              <div
                key={n._id}
                className="border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{n.title}</p>
                  <span
                    className={
                      n.published ? "text-green-400 text-xs" : "text-red-400 text-xs"
                    }
                  >
                    {n.published ? "Published" : "Hidden"}
                  </span>
                </div>

                <p className="text-gray-500 text-xs mt-1">/notices/{n.slug}</p>

                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                  {n.excerpt}
                </p>

                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/notices/${n.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-xs hover:border-[#D4AF37] transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => editNotice(n)}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:opacity-90 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => togglePublished(n)}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-xs hover:border-[#D4AF37] transition"
                  >
                    {n.published ? "Hide" : "Publish"}
                  </button>
                  <button
                    onClick={() => deleteNotice(n._id)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
