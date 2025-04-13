import Link from "next/link";

export const Ads2 = ({
  image,
  title,
  subtitle,
}: {
  image: string;
  title: string;
  subtitle: string;
}) => {
  return (
    <div
      className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md p-6 flex flex-col justify-end"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <p className="text-green-600 font-bold text-sm">WEEKEND DISCOUNT 40%</p>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-700">{subtitle}</p>
      <Link
        href="/product-category"
        className="mt-3 text-center px-4 py-2 text-sm font-medium bg-gray-300 text-gray-800 rounded-lg"
      >
        Shop Now
      </Link>
    </div>
  );
};

export default Ads2;
