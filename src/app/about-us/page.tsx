import Image from "next/image";

export default function page() {
  return (
    <div className="py-32 md:py-0">
      <div className="relative h-96 md:h-[500px] w-full">
        <Image
          src="/about-header.jpg"
          alt="Bacola About Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              About Bacola
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Your trusted partner for quality groceries and exceptional service
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          We can do more for you
        </h2>
        <div className="w-20 h-1 bg-cyan-600 mx-auto mb-8"></div>
        <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative">
              <div className="relative h-full min-h-[400px] w-full">
                <Image
                  src="/about-people.jpg"
                  alt="Machail Johnson, CEO of Bacola"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-600/30 transform -translate-x-6 translate-y-6"></div>
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="relative">
                <div className="absolute -left-8 -top-8 w-16 h-16 bg-cyan-600/10 rounded-lg z-0"></div>
                <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-cyan-600/10 rounded-lg z-0"></div>

                <div className="relative z-10">
                  <span className="text-cyan-600 font-medium tracking-wider">
                    OUR FOUNDER
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                    Machail Johnson
                  </h2>
                  <p className="text-cyan-600 font-medium mb-6">
                    CEO & Founder
                  </p>

                  <div className="space-y-4 text-gray-600">
                    <p>
                      With over 15 years in the grocery industry, Machail
                      founded Bacola with a vision to revolutionize how people
                      shop for quality food products.
                    </p>
                    <p>
                      Her commitment to sustainable sourcing and customer
                      satisfaction has made Bacola a leader in the online
                      grocery space.
                    </p>
                    <p>
                      "We believe everyone deserves access to fresh,
                      high-quality groceries delivered with convenience and
                      care."
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <svg
                        className="w-6 h-6 text-cyan-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Machail@bacola.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Bacola Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Fast Delivery",
              description:
                "Same-day shipping on most orders with reliable tracking",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-cyan-500"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              ),
            },
            {
              title: "Quality Guarantee",
              description:
                "Premium products backed by our 100% satisfaction promise",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-cyan-500"
                >
                  <path d="M12 2L3 7l9 5 9-5-9-5z" />
                  <path d="M3 7v10l9 5 9-5V7" />
                  <path d="M12 22V12" />
                  <path d="M7.5 10.5l9-5" />
                  <path d="M16.5 10.5l-9-5" />
                </svg>
              ),
            },
            {
              title: "Secure Shopping",
              description: "Your data is protected with bank-level encryption",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-cyan-500"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
            },
            {
              title: "24/7 Support",
              description: "Real customer service anytime you need assistance",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-cyan-500"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              ),
            },
            {
              title: "Easy Returns",
              description: "Hassle-free 30-day return policy on all items",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-cyan-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ),
            },
            {
              title: "Eco-Friendly",
              description: "Sustainable packaging and carbon-neutral shipping",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-cyan-500"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M12 8a4 4 0 0 1 4 4" />
                  <path d="M12 16a4 4 0 0 0 4-4" />
                </svg>
              ),
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center hover:border-cyan-200 group"
            >
              <div className="text-cyan-500 mb-4 group-hover:text-cyan-600 transition-colors">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-cyan-700 transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-600 group-hover:text-cyan-800 transition-colors">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
