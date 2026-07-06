import { Link } from "react-router-dom";

const categories = ["Fruits", "Vegetables", "Dairy"];

export default function CategoryBar() {
  return (
    <div className="overflow-x-auto whitespace-nowrap p-6">
      {categories.map(cat => (
        <Link
          key={cat}
          to={`/category/${cat}`}
          className="inline-block bg-green-100 px-6 py-3 rounded-full mr-4 hover:bg-green-300"
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
