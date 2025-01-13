const Favorite = require('../../models/favorite.model');

module.exports.ensureFavorite = async (req, res, next) => {
    try {
        const user = res.locals.user;

        if (!user || !user.id) {
            res.locals.miniFavorite = 0;
            return next();
        }

        const userId = user.id;
        let favorite = await Favorite.findOne({ user_id: userId });

        if (!favorite) {
            favorite = new Favorite({ user_id: userId, products: [] });
            await favorite.save();
        }

        res.locals.miniFavorite = favorite.products.length;

        next();
    } catch (error) {
        console.error('Error in ensureFavorite middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
