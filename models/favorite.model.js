const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true, 
            required: true,
        },
        products: [
            {
                product_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true, 
                },
                added_at: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true, 
    }
);

// Tạo index để tối ưu hóa các truy vấn tìm kiếm theo product_id và user_id
FavoriteSchema.index({ user_id: 1, 'products.product_id': 1 });

const Favorite = mongoose.model('Favorite', FavoriteSchema, 'favorites');
module.exports = Favorite;
