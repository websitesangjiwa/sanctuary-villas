export interface GuestyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface GuestyApiError {
  error: string;
  error_description?: string;
}

// Listing types
export interface GuestyPicture {
  original: string;
  large?: string;
  regular?: string;
  thumbnail: string;
  caption?: string;
}

export interface GuestyAddress {
  full: string;
  street?: string;
  city: string;
  state?: string;
  country: string;
  zipcode?: string;
  lat?: number;
  lng?: number;
}

export interface GuestyPrices {
  basePrice: number;
  currency: string;
  weeklyPriceFactor?: number;
  monthlyPriceFactor?: number;
  cleaningFee?: number;
  extraPersonFee?: number;
  petFee?: number;
}

export interface GuestyPublicDescription {
  summary?: string;
  space?: string;
  access?: string;
  neighborhood?: string;
  transit?: string;
  notes?: string;
  houseRules?: string;
}

export interface GuestyListing {
  _id: string;
  title: string;
  nickname?: string;
  propertyType?: string;
  roomType?: string;
  accommodates: number;
  bedrooms: number;
  bathrooms: number;
  beds?: number;
  address: GuestyAddress;
  pictures: GuestyPicture[];
  prices: GuestyPrices;
  publicDescription?: GuestyPublicDescription;
  amenities?: string[];
  terms?: {
    minNights?: number;
    maxNights?: number;
  };
}

export interface GuestyListingsResponse {
  results: GuestyListing[];
  count?: number;
  limit?: number;
  skip?: number;
}

export interface GuestySearchParams {
  checkIn: string;
  checkOut: string;
  guests?: number;
  minOccupancy?: number;
}

// Quote types
export interface GuestyQuoteFee {
  name: string;
  amount: number;
  type?: string;
}

export interface GuestyQuote {
  _id: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  currency: string;
  accommodationFare: number;
  fees: GuestyQuoteFee[];
  taxes?: GuestyQuoteFee[];
  totalPrice: number;
}

export interface GuestyQuoteRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
