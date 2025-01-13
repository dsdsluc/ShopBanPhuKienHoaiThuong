const Setting = require("../../models/setting.model");

module.exports.getSettingsGeneral = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = new Setting();
            await settings.save();
        }

        res.render("admin/pages/settings/general", {
            title: "Cài Đặt Chung",
            titleTopbar: "Setting General",
            settings,
            prefixAdmin: req.prefixAdmin || 'admin'
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy cài đặt chung:", error);
        req.flash('error', 'Có lỗi xảy ra khi tải cài đặt.');
        res.redirect("back");
    }
};

module.exports.update = async (req, res) => {
    try {
        const { site_name, contact_email, contact_phone, address } = req.body;
        const social_links = {
            facebook: req.body.facebook || "",
            twitter: req.body.twitter || "",
            instagram: req.body.instagram || "",
            zalo: req.body.zalo || "" 
        };

        const settings = await Setting.findOne();
        if (!settings) {
            req.flash('error', 'Cài đặt không tồn tại!');
            return res.redirect("back");
        }

        settings.site_name = site_name;
        settings.contact_email = contact_email;
        settings.contact_phone = contact_phone;
        settings.address = address;
        settings.social_links = social_links;


        if (req.body && req.body.site_logo) {
            settings.site_logo = req.body.site_logo; // Đường dẫn Cloudinary hoặc lưu local
        }

        await settings.save();

        req.flash('success', 'Cài đặt đã được cập nhật thành công!');
        res.redirect(`/${req.prefixAdmin || 'admin'}/setting/general`);
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật cài đặt:", error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật cài đặt.');
        res.redirect("back");
    }
};
