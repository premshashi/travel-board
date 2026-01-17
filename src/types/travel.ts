export interface TravelPost {
  id: string;
  travelDate: string;
  departureTime: string;
  origin: string;
  originFull: string;
  destination: string;
  destinationFull: string;
  flightNumber: string;
  airline: string;
  requestType: 'need_companion' | 'offering_companion';
  postedBy: string;
  contactMethod: 'instagram' | 'whatsapp' | 'email' | 'phone';
  contactId: string;
  createdAt: string;
}

export interface FilterOptions {
  origin: string;
  destination: string;
  airline: string;
}

export const AIRPORTS = {
  // US Airports
  JFK: 'John F. Kennedy International',
  EWR: 'Newark Liberty International',
  LAX: 'Los Angeles International',
  SFO: 'San Francisco International',
  ORD: "O'Hare International",
  ATL: 'Hartsfield-Jackson Atlanta',
  DFW: 'Dallas/Fort Worth International',
  IAD: 'Washington Dulles International',
  BOS: 'Boston Logan International',
  SLC: 'Salt Lake City International',
  // India Airports
  DEL: 'Indira Gandhi International',
  BOM: 'Chhatrapati Shivaji Maharaj',
  BLR: 'Kempegowda International',
  MAA: 'Chennai International',
  HYD: 'Rajiv Gandhi International',
  CCU: 'Netaji Subhas Chandra Bose',
  COK: 'Cochin International',
  TRV: 'Trivandrum International',
  AMD: 'Sardar Vallabhbhai Patel',
  PNQ: 'Pune International',
};

export const AIRLINES = [
  'Air India',
  'United Airlines',
  'American Airlines',
  'Delta Airlines',
  'Emirates',
  'Qatar Airways',
  'Etihad Airways',
  'British Airways',
  'Lufthansa',
  'Singapore Airlines',
];
