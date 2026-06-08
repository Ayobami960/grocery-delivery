import { Link } from "react-router"
import { categoriesData } from "../../assets/assets"

const HomeCategories = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold">Browse Categories</h2>
          <p className="text-sm text-app-text-light mt-1">
            Find exactly what you need using
          </p>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex items-start mt-8 overflow-x-auto no-scrollbar gap-2">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              onClick={() => window.scrollTo(0, 0)}
              className="group flex flex-col items-center gap-3 p-4 flex-shrink-0 w-24 sm:w-28"
            >
              {/* Fixed-size square image box — equal for every card */}
              <div className="size-16 sm:size-20 rounded-2xl overflow-hidden bg-orange-100
                group-hover:ring-2 ring-orange-300/75 transition-all">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text constrained to card width so it wraps evenly */}
              <span className="text-xs font-medium text-zinc-600 text-center leading-tight w-full line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeCategories