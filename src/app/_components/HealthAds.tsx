function HealthAds() {
  return (
    <div
      className="relative w-full bg-opacity-25 justify-end h-[300px] md:h-[150px] xl:h-[150px] p-5 rounded-sm flex"
      style={{ backgroundColor: "#f8efea" }}
    >
      <img
        src="banner-box2.jpg"
        className="opacity-100 absolute  md:right-0   bottom-0 h-[150px] xl:h-[120px]"
      />

      <div className="absolute left-5 xl:left-10 top-5 xl:top-10">
        <p className="text-slate-400">Always Taking Care</p>
        <p className="text-xl text-slate-600 font-bold w-52 xl:w-full">
          In store online your health & saftey is our priority.
        </p>
      </div>
    </div>
  );
}

export default HealthAds;
