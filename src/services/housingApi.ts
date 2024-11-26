import axios from 'axios';

const API_KEY = 'a9f0778b1cmshc343c764ac997c8p1aa701jsn52a949d7d714';
const BASE_URL = 'https://zillow-com1.p.rapidapi.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
  }
});

export type HousingSearchParams = {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  propertyType?: string;
};

export type PropertyResponse = {
  id: string;
  imgSrc: string;
  price: string;
  address: string;
  beds: string;
  baths: string;
  area: string;
  propertyType: string;
  listingStatus: string;
  latitude: number;
  longitude: number;
};

const MOCK_PROPERTIES: PropertyResponse[] = [
  {
    id: '1',
    imgSrc: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    price: '$750,000',
    address: '123 Maple Street, Toronto, ON',
    beds: '3',
    baths: '2',
    area: '2,000 sqft',
    propertyType: 'House',
    listingStatus: 'For Sale',
    latitude: 43.6532,
    longitude: -79.3832
  },
  {
    id: '2',
    imgSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    price: '$450,000',
    address: '456 Oak Avenue, Vancouver, BC',
    beds: '2',
    baths: '1',
    area: '1,200 sqft',
    propertyType: 'Condo',
    listingStatus: 'For Sale',
    latitude: 49.2827,
    longitude: -123.1207
  },
  {
    id: '3',
    imgSrc: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
    price: '$2,500/month',
    address: '789 Pine Road, Montreal, QC',
    beds: '1',
    baths: '1',
    area: '800 sqft',
    propertyType: 'Apartment',
    listingStatus: 'For Rent',
    latitude: 45.5017,
    longitude: -73.5673
  }
];

export const searchProperties = async (params: HousingSearchParams): Promise<PropertyResponse[]> => {
  // Using mock data for now since the Zillow API has limitations
  // Filter mock data based on search params
  let filteredProperties = [...MOCK_PROPERTIES];

  if (params.location) {
    filteredProperties = filteredProperties.filter(property =>
      property.address.toLowerCase().includes(params.location!.toLowerCase())
    );
  }

  if (params.propertyType) {
    filteredProperties = filteredProperties.filter(property =>
      property.propertyType.toLowerCase() === params.propertyType!.toLowerCase()
    );
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return filteredProperties;
};