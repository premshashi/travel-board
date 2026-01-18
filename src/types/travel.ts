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
  contactMethod: 'instagram' | 'facebook' | 'email';
  contactId: string;
  additionalComments?: string;
  createdAt: string;
}

export interface FilterOptions {
  origin: string;
  destination: string;
  airline: string;
}

export const AIRPORTS = {
  // US Airports
  JFK: 'John F. Kennedy International, New York',
  EWR: 'Newark Liberty International, New Jersey',
  LAX: 'Los Angeles International, California',
  SFO: 'San Francisco International, California',
  ORD: "O'Hare International, Chicago",
  ATL: 'Hartsfield-Jackson Atlanta International',
  DFW: 'Dallas/Fort Worth International, Texas',
  IAD: 'Washington Dulles International, DC',
  BOS: 'Boston Logan International, Massachusetts',
  SLC: 'Salt Lake City International, Utah',
  MIA: 'Miami International, Florida',
  SEA: 'Seattle-Tacoma International, Washington',
  DEN: 'Denver International, Colorado',
  IAH: 'George Bush Intercontinental, Houston',
  PHX: 'Phoenix Sky Harbor International, Arizona',
  MSP: 'Minneapolis-Saint Paul International',
  DTW: 'Detroit Metropolitan, Michigan',
  PHL: 'Philadelphia International, Pennsylvania',
  CLT: 'Charlotte Douglas International, North Carolina',
  SAN: 'San Diego International, California',
  TPA: 'Tampa International, Florida',
  FLL: 'Fort Lauderdale-Hollywood International',
  BWI: 'Baltimore/Washington International',
  DCA: 'Ronald Reagan Washington National',
  PDX: 'Portland International, Oregon',
  HNL: 'Daniel K. Inouye International, Honolulu',
  AUS: 'Austin-Bergstrom International, Texas',
  MCO: 'Orlando International, Florida',
  LAS: 'Harry Reid International, Las Vegas',
  // India Airports
  DEL: 'Indira Gandhi International, New Delhi',
  BOM: 'Chhatrapati Shivaji Maharaj International, Mumbai',
  BLR: 'Kempegowda International, Bengaluru',
  MAA: 'Chennai International, Chennai',
  HYD: 'Rajiv Gandhi International, Hyderabad',
  CCU: 'Netaji Subhas Chandra Bose International, Kolkata',
  COK: 'Cochin International, Kochi',
  TRV: 'Trivandrum International, Thiruvananthapuram',
  AMD: 'Sardar Vallabhbhai Patel International, Ahmedabad',
  PNQ: 'Pune International, Pune',
  GOI: 'Goa International, Dabolim',
  JAI: 'Jaipur International, Jaipur',
  LKO: 'Chaudhary Charan Singh International, Lucknow',
  IXC: 'Chandigarh International, Chandigarh',
  GAU: 'Lokpriya Gopinath Bordoloi International, Guwahati',
  SXR: 'Sheikh ul-Alam International, Srinagar',
  IXB: 'Bagdogra International, Siliguri',
  VTZ: 'Visakhapatnam International, Vizag',
  IXE: 'Mangalore International, Mangalore',
  CJB: 'Coimbatore International, Coimbatore',
  ATQ: 'Sri Guru Ram Dass Jee International, Amritsar',
  VNS: 'Lal Bahadur Shastri International, Varanasi',
  PAT: 'Jay Prakash Narayan International, Patna',
  BBI: 'Biju Patnaik International, Bhubaneswar',
  NAG: 'Dr. Babasaheb Ambedkar International, Nagpur',
  IDR: 'Devi Ahilyabai Holkar International, Indore',
  TIR: 'Tirupati International, Tirupati',
  CCJ: 'Calicut International, Kozhikode',
};

export const AIRLINES = [
  // Indian Airlines
  'Air India',
  'Air India Express',
  'IndiGo',
  'Vistara',
  // US Airlines
  'United Airlines',
  'American Airlines',
  'Delta Air Lines',
  'Alaska Airlines',
  'JetBlue Airways',
  'Hawaiian Airlines',
  // Middle Eastern Airlines
  'Emirates',
  'Qatar Airways',
  'Etihad Airways',
  'Oman Air',
  'Gulf Air',
  'Saudia',
  'Kuwait Airways',
  // European Airlines
  'British Airways',
  'Lufthansa',
  'Air France',
  'KLM Royal Dutch Airlines',
  'Swiss International Air Lines',
  'Virgin Atlantic',
  'Finnair',
  'SAS Scandinavian Airlines',
  'Turkish Airlines',
  'Aer Lingus',
  'Icelandair',
  'TAP Air Portugal',
  'Iberia',
  'Austrian Airlines',
  'LOT Polish Airlines',
  // Asian Airlines
  'Singapore Airlines',
  'Cathay Pacific',
  'Japan Airlines',
  'All Nippon Airways (ANA)',
  'Korean Air',
  'Asiana Airlines',
  'Thai Airways',
  'Malaysia Airlines',
  'Garuda Indonesia',
  'Philippine Airlines',
  'China Airlines',
  'EVA Air',
  'China Eastern Airlines',
  'China Southern Airlines',
  'Air China',
  'Hainan Airlines',
  // Other International
  'Qantas',
  'Air New Zealand',
  'South African Airways',
  'Ethiopian Airlines',
];
