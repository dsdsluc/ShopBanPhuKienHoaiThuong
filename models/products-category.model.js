const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

// ✅ **Kích hoạt plugin tạo slug tự động**
mongoose.plugin(slug);

// 🛍️ **Schema ProductCategory**
const ProductCategorySchema = new mongoose.Schema(
  {
    // 📌 **Tiêu đề và Slug**
    title: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 200 
    },
    slug: { 
      type: String, 
      slug: "title", 
      unique: true, 
      slugPaddingSize: 4 
    },

    // 📝 **Mô tả**
    description: { 
      type: String, 
      default: "", 
      trim: true 
    },

    // 🖼️ **Ảnh đại diện**
    thumbnail: { 
      type: String, 
      default: ""
    },
    isFeatured: { type: Boolean, default: false }, 
    isMostLiked: { type: Boolean, default: false },
    // 📊 **Trạng thái & Vị trí**
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active" 
    },
    position: { 
      type: Number, 
      default: 1
    },

    // 🛡️ **Xóa mềm**
    deleted: { 
      type: Boolean, 
      default: false 
    },

    // 👤 **Người tạo**
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Account", 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

// 🛠️ **Indexing**
ProductCategorySchema.index({ status: 1, parent_id: 1 });
ProductCategorySchema.index({ slug: 1 });

// 🚀 **Export Model**
const ProductCategory = mongoose.model("ProductCategory", ProductCategorySchema, "products-category");
module.exports = ProductCategory;
