"use client";

function ProgressCart({
  progressShapping,
}: {
  progressShapping?: ProgressShapping;
}) {
  return (
    <div className="border p-4">
      <p className="text-sm ">
        {progressShapping?.compelete ? (
          <span className="text-emerald-700">You compelete shipping rate!</span>
        ) : (
          <>
            Add{" "}
            <span className="text-pink-600 font-bold">
              ${progressShapping?.left_money.toFixed(2)}
            </span>{" "}
            to cart and get free shipping!
          </>
        )}
      </p>
      <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full">
        <div
          className={`h-1.5 ${
            progressShapping?.compelete ? "bg-emerald-600" : "bg-pink-600"
          } rounded-full`}
          style={{ width: `${progressShapping?.precentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressCart;
