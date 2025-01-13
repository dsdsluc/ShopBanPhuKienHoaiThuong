const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    });
    res.render('clients/pages/home/index', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      products: products
    });
};
  



