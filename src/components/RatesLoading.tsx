const RatesLoading = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm animate-pulse"
        >
          <div className="flex items-center space-x-3">
            {/* Product image placeholder */}
            <div className="w-12 h-12 bg-gray-200 rounded-md"></div>

            <div className="space-y-2">
              {/* Rating stars placeholder */}
              <div className="flex space-x-1">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="w-4 h-4 bg-gray-300 rounded-full"
                  ></div>
                ))}
              </div>

              {/* Product name placeholder */}
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-100 rounded w-24"></div>
            </div>
          </div>

          {/* View button placeholder */}
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default RatesLoading;
