"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-10 text-white text-xl">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-10 text-white">Failed to load analytics.</div>;
  }

  const {
    daily,
    topProducts,
    statusBreakdown,
    summary,
    funnel,
    conversionRate,
    dailyVisitors = [],
    devices = [],
    locations = [],
    abandoned = { carts: 0, checkouts: 0, rate: 0 },
  } = data;

  const maxDailyVisitors = Math.max(
    ...dailyVisitors.map((d) => d.visitors),
    1
  );
  const totalDeviceVisitors =
    devices.reduce((s, d) => s + d.visitors, 0) || 1;

  const funnelSteps = funnel
    ? [
        { label: "Visitors", value: funnel.visitors },
        { label: "Viewed a Product", value: funnel.productViewers },
        { label: "Added to Cart", value: funnel.cartAdders },
        { label: "Started Checkout", value: funnel.checkoutStarters },
        { label: "Purchased", value: funnel.purchased },
      ]
    : [];
  const maxFunnel = Math.max(...funnelSteps.map((s) => s.value), 1);
  const maxRevenue = Math.max(...daily.map((d) => d.revenue), 1);
  const maxProductRevenue = Math.max(
    ...topProducts.map((p) => p.revenue),
    1
  );
  const totalStatus =
    statusBreakdown.Pending +
      statusBreakdown.Delivered +
      statusBreakdown.Cancelled || 1;

  return (
    <div className="p-8 text-white space-y-10">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-[#D4AF37]">
            ₹{summary.totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Orders</p>
          <p className="text-3xl font-bold">{summary.totalOrders}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold">
            ₹{summary.avgOrderValue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* VISITS + ABANDONED CARTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">
            Visitors (30 days)
          </p>
          <p className="text-3xl font-bold text-[#D4AF37]">
            {funnel?.visitors ?? 0}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">
            Abandoned Carts
          </p>
          <p className="text-3xl font-bold text-red-400">
            {abandoned.carts}
            <span className="text-base text-gray-400 font-normal ml-2">
              ({abandoned.rate}% abandon rate)
            </span>
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-2">
            Abandoned Checkouts
          </p>
          <p className="text-3xl font-bold text-yellow-400">
            {abandoned.checkouts}
          </p>
        </div>
      </div>

      {/* DAILY VISITORS CHART */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">
          Daily Visitors — Last 30 Days
        </h2>
        <div className="flex items-end gap-[3px] h-36">
          {dailyVisitors.map((d) => (
            <div key={d.date} className="flex-1 group relative h-full">
              <div
                className="absolute bottom-0 w-full bg-white/40 hover:bg-white/70 rounded-t transition-all"
                style={{
                  height: `${Math.max(
                    (d.visitors / maxDailyVisitors) * 100,
                    d.visitors > 0 ? 5 : 1
                  )}%`,
                }}
              />
              <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap z-10">
                {d.date.slice(5)} · {d.visitors} visitors
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEVICES + LOCATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Devices</h2>
          {devices.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-5">
              {devices.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{d.name}</span>
                    <span className="text-gray-400">
                      {d.visitors} (
                      {Math.round(
                        (d.visitors / totalDeviceVisitors) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] rounded-full"
                      style={{
                        width: `${
                          (d.visitors / totalDeviceVisitors) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Top Locations</h2>
          {locations.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-4">
              {locations.map((l) => (
                <div
                  key={l.name}
                  className="flex items-center justify-between border-b border-white/5 pb-3"
                >
                  <span className="text-sm">{l.name}</span>
                  <span className="text-[#D4AF37] font-semibold text-sm">
                    {l.visitors} visitors
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-gray-500 text-xs mt-5">
            City/country data appears after deploying to production
            (Vercel). Localhost shows &ldquo;Unknown&rdquo;.
          </p>
        </div>
      </div>

      {/* VISITOR FUNNEL — LAST 30 DAYS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold">
            Visitor Funnel — Last 30 Days
          </h2>
          <span className="text-sm text-gray-400">
            Conversion Rate:{" "}
            <span className="text-[#D4AF37] font-bold">
              {conversionRate}%
            </span>
          </span>
        </div>

        {funnel && funnel.visitors === 0 ? (
          <p className="text-gray-400 text-sm">
            No visitor data yet. Tracking just started — data will appear
            as people browse your store.
          </p>
        ) : (
          <div className="space-y-4">
            {funnelSteps.map((step, i) => {
              const prev = i > 0 ? funnelSteps[i - 1].value : null;
              const dropOff =
                prev && prev > 0
                  ? Math.round(((prev - step.value) / prev) * 100)
                  : null;

              return (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{step.label}</span>
                    <span className="text-gray-400">
                      {step.value}
                      {dropOff !== null && dropOff > 0 && (
                        <span className="text-red-400 ml-2">
                          −{dropOff}% drop
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-6 bg-white/10 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37] rounded-lg transition-all"
                      style={{
                        width: `${Math.max(
                          (step.value / maxFunnel) * 100,
                          step.value > 0 ? 3 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REVENUE CHART — LAST 30 DAYS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">
          Revenue — Last 30 Days
        </h2>
        <div className="flex items-end gap-[3px] h-48">
          {daily.map((d) => (
            <div
              key={d.date}
              className="flex-1 group relative"
              style={{ height: "100%" }}
            >
              <div
                className="absolute bottom-0 w-full bg-[#D4AF37]/70 hover:bg-[#D4AF37] rounded-t transition-all"
                style={{
                  height: `${Math.max(
                    (d.revenue / maxRevenue) * 100,
                    d.revenue > 0 ? 4 : 1
                  )}%`,
                }}
              />
              <div className="hidden group-hover:block absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap z-10">
                {d.date.slice(5)} · ₹{d.revenue.toLocaleString("en-IN")} ·{" "}
                {d.orders} orders
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span>{daily[0]?.date}</span>
          <span>{daily[daily.length - 1]?.date}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TOP PRODUCTS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-400">No sales data yet.</p>
          ) : (
            <div className="space-y-5">
              {topProducts.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{p.name}</span>
                    <span className="text-gray-400">
                      {p.units} sold · ₹
                      {p.revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] rounded-full"
                      style={{
                        width: `${(p.revenue / maxProductRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ORDER STATUS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Order Status</h2>
          <div className="space-y-5">
            {[
              {
                label: "Pending",
                count: statusBreakdown.Pending,
                color: "bg-yellow-400",
                text: "text-yellow-400",
              },
              {
                label: "Delivered",
                count: statusBreakdown.Delivered,
                color: "bg-green-400",
                text: "text-green-400",
              },
              {
                label: "Cancelled",
                count: statusBreakdown.Cancelled,
                color: "bg-red-400",
                text: "text-red-400",
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className={s.text}>{s.label}</span>
                  <span className="text-gray-400">
                    {s.count} (
                    {Math.round((s.count / totalStatus) * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full`}
                    style={{
                      width: `${(s.count / totalStatus) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
