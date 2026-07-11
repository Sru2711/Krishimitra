"use client";

const FarmerAdvisory = () => {
  return (
    <div className="w-full  bg-bg">
  <div className="w-full max-w-7xl mx-auto">

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-recommendation">
        🌾 Farm Advisory
      </h1>
      <p className="mt-2 text-gray-600">
        Personalized guidance based on your crop, weather and farming history.
      </p>
    </div>

    {/* Top Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Pest Risk */}
      <div className="rounded-xl bg-advisory border border-black p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-recommendation mb-5">
          🐛 Pest Risk
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Disease</p>
            <p className="text-xl font-medium">
              Soybean Rust
            </p>
          </div>

          <div>
            <span className="rounded-full bg-alert-amber/20 px-4 py-1 text-alert-amber font-semibold">
              Medium Risk
            </span>
          </div>

          <p className="text-gray-700">
            High humidity this week increases the chance of soybean rust.
          </p>
        </div>
      </div>

      {/* Treatment */}
      <div className="rounded-xl bg-advisory border border-black p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-recommendation mb-5">
          🌿 Recommended Treatment
        </h2>

        <div className="space-y-3">
          <p className="text-xl font-medium">
            Neem Oil Spray
          </p>

          <p>
            Apply during early morning or evening.
          </p>

          <p className="text-gray-600">
            Repeat every 7 days if symptoms continue.
          </p>
        </div>
      </div>

      {/* Crop Rotation */}
      <div className="rounded-xl bg-advisory border border-black p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-recommendation mb-5">
          🌱 Crop Rotation
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              Previous Crop
            </p>
            <p className="text-xl font-medium">
              Cotton
            </p>
          </div>

          <div className="text-3xl text-center">
            ↓
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Suggested Crop
            </p>
            <p className="text-xl font-medium text-recommendation">
              Soybean
            </p>
          </div>
        </div>
      </div>

      {/* Sowing Window */}
      <div className="rounded-xl bg-advisory border border-black p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-recommendation mb-5">
          📅 Sowing Window
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Start</span>
            <span className="font-semibold">
              22 Jun
            </span>
          </div>

          <div className="flex justify-between">
            <span>End</span>
            <span className="font-semibold">
              30 Jun
            </span>
          </div>

          <div className="rounded-lg bg-green-100 p-3 text-green-800 font-medium">
            Best period for sowing soybean.
          </div>

        </div>
      </div>

    </div>

    {/* Weather Advisory */}
    <div className="mt-6 rounded-xl bg-weather-card/10 border border-weather-card p-6">
      <h2 className="text-2xl font-semibold mb-4">
        🌦 Weather Advisory
      </h2>

      <ul className="space-y-2 list-disc ml-5">
        <li>Heavy rainfall expected tomorrow.</li>
        <li>Delay pesticide spraying.</li>
        <li>Improve field drainage.</li>
        <li>Avoid fertilizer application today.</li>
      </ul>
    </div>

    {/* AI Summary */}
    <div className="mt-6 rounded-xl bg-white border border-black p-6">
      <h2 className="text-2xl font-semibold mb-4">
        🤖 AI Summary
      </h2>

      <p className="leading-8 text-gray-700">
        Weather conditions are favorable for soybean cultivation.
        Monitor your field for soybean rust because humidity levels
        are increasing. Delay pesticide spraying until rainfall
        subsides. The next few days remain suitable for sowing.
      </p>
    </div>

  </div>
</div>
  );
};

export default FarmerAdvisory;
