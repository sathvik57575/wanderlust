const mongoose = require('mongoose');

const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", filename: "image1"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    owner: new mongoose.Types.ObjectId('6930172638837e20c282100f'),
    geometry: {type: 'Point', coordinates: [-118.6923,34.038]},
    category: 'amazing pools'
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", filename: 'image2' },
    price: 1200,
    location: "New York City",
    country: "United States",
    owner: new mongoose.Types.ObjectId('6930172638837e20c282100f'),
    geometry: {type: 'Point', coordinates: [-74.01,40.71]},
    category: 'mountains'
  },
  {
    title: "Mountain Retreat",
    description:"Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    price: 1000,
    location: "Aspen",
    country: "United States",
    owner: new mongoose.Types.ObjectId('6930172638837e20c282100f'),
    geometry: {type: 'Point', coordinates: [-106.8175,39.1911]},
    category: 'arctic'
  }
];

module.exports = { sampleListings };