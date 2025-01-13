const mongoose = require('mongoose');

const HomePageSchema = new mongoose.Schema({
  banners: [
    {
      image: { type: String }, // URL/path to the banner image
      link: { type: String, default: '#' }, // Clickable link for the banner
      title: { type: String }, // Title for the banner
    },
  ],
  featuredCategories: [
    {
      name: { type: String }, // Category name
      image: { type: String }, // URL/path to the category image
      link: { type: String, default: '#' }, // Link to the category page
    },
  ]
});

// Middleware to update `updatedAt` automatically
HomePageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const HomePage = mongoose.model('HomePage', HomePageSchema, 'homePages');
module.exports = HomePage;
