const ProductCategory = require("../../models/products-category.model");

module.exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
      isMostLiked: true
    })
      .sort({ position: -1 }) 
      .limit(4); 

    res.locals.categories = categories || [];

    next(); 
  } catch (error) {
    console.error("❌ Error fetching product categories:", error);

    // Attach an empty array in case of an error
    res.locals.categories = [];

    next(); // Continue even if an error occurs
  }
};
module.exports.getFeatureCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
      isFeatured: true
    })
      .sort({ position: -1 }) 
      .limit(5); 

    res.locals.categoriesFeature = categories || [];

    next(); 
  } catch (error) {
    console.error("❌ Error fetching product categories:", error);

    // Attach an empty array in case of an error
    res.locals.categories = [];

    next(); // Continue even if an error occurs
  }
};
