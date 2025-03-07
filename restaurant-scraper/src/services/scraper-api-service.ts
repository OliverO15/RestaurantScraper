import { Restaurant } from "../types/types";


const url = 'https://restaurant-scraper-api.onrender.com/';

export const getRestaurants = async (num_requests: number) => {
    const response = await fetch(`${url}restaurants?num_requests=${num_requests}`);
    return response.json();
};

export const getResturantsInstagram = async (num_requests: number) => {
    const response = await fetch(`${url}instagram_followers?num_requests=${num_requests}`);
    const json = await response.json();

    return json.restaurants.map((restaurant: Restaurant) => ({
        name: restaurant.name,
        website: restaurant.website,
        instagram_url: restaurant.instagram_url
    }));
};