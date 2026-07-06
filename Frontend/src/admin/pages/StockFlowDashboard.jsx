import { useEffect, useState } from "react";
import axios from "axios";
import { FilterX } from "lucide-react";
import Pagination from "../component/Pagination";

/* ---------- Status Badge ---------- */
const StatusBadge = ({ label, type }) => {
  const map = {
    fast: "bg-emerald-100 text-emerald-800 ring-emerald-200/50",
    slow: "bg-amber-100 text-amber-800 ring-amber-200/50",
    dead: "bg-rose-100 text-rose-800 ring-rose-200/50",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        map[type] || "bg-slate-100 text-slate-800 ring-slate-200/50"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          type === "fast"
            ? "bg-emerald-500"
            : type === "slow"
            ? "bg-amber-500"
            : "bg-rose-500"
        }`}
      />
      {label}
    </span>
  );
};

/* ---------- Table Row ---------- */
const ProductRow = ({ item }) => {
  const sold = item.soldQty || 0;
  const stock = item.stock || 0;
  const total = sold + stock;
  const percent = total === 0 ? 0 : Math.min((sold / total) * 100, 100);

  const type = item.__status;

  return (
    <tr className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/50 transition-colors">
      <td className="px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={item.productImage?.[0] || "/no-image.png"}
              alt={item.productName}
              className="h-10 w-10 rounded-lg border object-cover ring-1 ring-slate-100"
            />
            <div
              className={`absolute -top-2 -right-2.5 h-6 w-6 rounded-full text-[10px] font-bold flex items-center justify-center ring-1 ring-white ${
                type === "fast"
                  ? "bg-emerald-500 text-white"
                  : type === "slow"
                  ? "bg-amber-500 text-white"
                  : "bg-rose-500 text-white"
              }`}
            >
              {percent.toFixed(0)}%
            </div>
          </div>
          <p className="font-medium text-slate-900 truncate">
            {item.productName}
          </p>
        </div>
      </td>

      <td className="px-4 py-3 text-sm">
        <span className="font-medium">{sold}</span>
        <span className="text-slate-500 text-xs"> / {stock}</span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full ${
                type === "fast"
                  ? "bg-emerald-500"
                  : type === "slow"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-medium">{percent.toFixed(0)}%</span>
        </div>
      </td>

      <td className="px-4 py-3 text-right">
        <StatusBadge
          type={type}
          label={type === "fast" ? "Fast" : type === "slow" ? "Slow" : "Dead"}
        />
      </td>
    </tr>
  );
};

/* ---------- Summary Card ---------- */
const SummaryCard = ({ label, count, type, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border cursor-pointer transition-all ${
      active
        ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200"
        : type === "fast"
        ? "bg-emerald-50/50 border-emerald-200"
        : type === "slow"
        ? "bg-amber-50/50 border-amber-200"
        : "bg-rose-50/50 border-rose-200"
    }`}
  >
    <p className="text-xs font-semibold uppercase">{label}</p>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

/* ---------- Main Component ---------- */
const StockFlowDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState({
    fastFlowing: [],
    slowFlowing: [],
    deadStock: [],
  });

  const itemsPerPage = 25;

  useEffect(() => {
    const fetchStockFlow = async () => {
      try {
        const authData = JSON.parse(sessionStorage.getItem("admin"));
        const token = authData?.token;

        const res = await axios.get("/api/orders/ProductStockFlow", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockFlow();
  }, []);

  /* ---------- MERGED + SORTED DATA ---------- */
  const statusPriority = { fast: 1, slow: 2, dead: 3 };

  const allProducts = [
    ...data.fastFlowing.map((p) => ({ ...p, __status: "fast" })),
    ...data.slowFlowing.map((p) => ({ ...p, __status: "slow" })),
    ...data.deadStock.map((p) => ({ ...p, __status: "dead" })),
  ];

  const filteredProducts = allProducts
    .filter((p) => (filter === "all" ? true : p.__status === filter))
    .sort((a, b) => statusPriority[a.__status] - statusPriority[b.__status]);

  /* ---------- PAGINATION ---------- */
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className=" rounded-xl  space-y-2">
      <h1 className="text-xl font-bold">Stock Flow Analytics</h1>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <SummaryCard
          label="Fast"
          count={data.fastFlowing.length}
          type="fast"
          active={filter === "fast"}
          onClick={() => {
            setFilter("fast");
            setCurrentPage(1);
          }}
        />
        <SummaryCard
          label="Slow"
          count={data.slowFlowing.length}
          type="slow"
          active={filter === "slow"}
          onClick={() => {
            setFilter("slow");
            setCurrentPage(1);
          }}
        />
        <SummaryCard
          label="Dead"
          count={data.deadStock.length}
          type="dead"
          active={filter === "dead"}
          onClick={() => {
            setFilter("dead");
            setCurrentPage(1);
          }}
        />

        {filter !== "all" && (
          <button
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 rounded-lg"
          >
            <FilterX size={14} /> Show All
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full border rounded-lg overflow-hidden bg-white">
        <thead className="bg-slate-200">
          <tr>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Flow</th>
            <th className="px-4 py-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((item) => (
            <ProductRow key={item._id} item={item} />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default StockFlowDashboard;
