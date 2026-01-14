export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-[#f5f3e8]">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
          </div>

          {/* Form Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Guest Info Skeleton */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Payment Skeleton */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Button Skeleton */}
              <div className="h-14 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Right Column - Order Summary Skeleton */}
            <div className="bg-[#fffdf3] rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />

              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                ))}
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
