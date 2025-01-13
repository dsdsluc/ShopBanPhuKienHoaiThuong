const ProductCategory = require("../../models/products-category.model");
const Product = require("../../models/product.model");
const Comment = require("../../models/comment.model");
const paginationHelper = require("../../helpers/pagination");

const productHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
  const pageCurrent = req.query.page ? parseInt(req.query.page, 10) : 1;
  const limitItem = 12;
  try {
    const find = {
      deleted: false,
      status: "active",
    };
    
    const query = req.query.query
    if (query && query.trim()) {
      const keywords = query.trim().split(/\s+/);

      find.$or = keywords.map((keyword) => {
        const regex = new RegExp(keyword, "i"); 
        return {
          $or: [
            { slug: regex },
            { title: regex }
          ],
        };
      });
    }

    if (req.body["categories[]"] && req.body["categories[]"].length > 0) {
      const categoryIds = Array.isArray(req.body["categories[]"])
        ? req.body["categories[]"]
        : [req.body["categories[]"]];
      find.product_category_id = { $in: categoryIds };
    }

    // Lọc theo khoảng giá

    if (req.query.price) {
      const [min, max] = productHelper.parseNumbers(req.query.price);
      if (min !== undefined && max !== undefined) {
        find.price = {
          $gte: min, // Lớn hơn hoặc bằng min
          $lte: max, // Nhỏ hơn hoặc bằng max
        };
      }
    }
    // Lọc theo chất liệu
    if (req.query.material) {
      const materials = req.query.material.split(",");
      find.material = { $in: materials }; // Sử dụng $in để lọc theo danh sách chất liệu
    }

    // Lọc theo loại sản phẩm
    if (req.query.type) {
      const types = req.query.type.split(",");
      find.type = { $in: types }; // Sử dụng $in để lọc theo danh sách loại sản phẩm
    }

    let sortOption = { position: "desc" };

    // Xử lý tham số sort
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price_asc":
          sortOption = { price: "asc" };
          break;
        case "price_desc":
          sortOption = { price: "desc" };
          break;
        case "newest":
          sortOption = { createdAt: "desc" };
          break;
        default:
          sortOption = { position: "desc" };
      }
    }
    const totalItem = await Product.countDocuments(find);

    // Xử lý phân trang
    const objectPagination = paginationHelper(
      pageCurrent,
      totalItem,
      limitItem
    );

    const productsDB = await Product.find(find)
      .sort(sortOption)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);
    const products = productHelper.priceNews(productsDB);

    res.render("clients/pages/products/index", {
      title: "Shop của tôi",
      message: "Hello there!",
      products,
      valueSearch: req.query.query,
      currentSort: req.query.sort || "default",
      pagination: objectPagination,
      sort: req.query.sort,
      totalItem: totalItem,
      categoriesChecked: req.body["categories[]"],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const slugProduct = req.params.slug;

    // Lấy sản phẩm từ slug
    const product = await Product.findOne({ slug: slugProduct }).populate(
      "product_category_id",
      "id title"
    );


    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm như vậy!");
      return res.redirect("back");
    }

    const categoryId =
      product.product_category_id?._id || product.product_category_id;

    // Lấy các sản phẩm liên quan (tối đa 5 sản phẩm)
    const relatedProducts = await Product.find({
      product_category_id: categoryId,
      _id: { $ne: product._id },
    }).limit(5).populate("product_category_id",
      "title");

    const newProduct = productHelper.priceNew(product);

    res.render("clients/pages/products/detail", {
      title: "Shop của tôi",
      message: "Hello there!",
      product: newProduct,
      relatedProducts: productHelper.priceNews(relatedProducts),
    });
  } catch (error) {
    console.error("Error in fetching product details:", error);
    req.flash("error", "Có lỗi xảy ra. Vui lòng thử lại sau!");
    res.redirect("back");
  }
};


module.exports.category = async (req, res) => {
  const slug = req.params.slug;

  const productCategory = await ProductCategory.findOne({
    slug: slug,
  });
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      deleted: false,
      status: "active",
    });

    let allSub = [...subs];

    for (const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  };
  const listSbuCategory = await getSubCategory(productCategory.id);
  const listSbuCategoryId = listSbuCategory.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [productCategory.id, ...listSbuCategoryId] },
  });
  const newProducts = productHelper.priceNews(products);
  res.render("clients/pages/products/index", {
    title: "Shop của tôi",
    message: "Hello there!",
    products: newProducts,
  });
};
