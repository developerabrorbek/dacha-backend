export const PERMISSIONS = {
  language: {
    get_all_language: {
      name: 'get_all_language',
      description: 'Barcha tillarni olish',
      user_access: true,
    },
    create_language: {
      name: 'create_language',
      description: 'Yangi til yaratish',
      user_access: false,
    },
    edit_language: {
      name: 'edit_language',
      description: 'Tillarni tahrirlash',
      user_access: false,
    },
    edit_language_image: {
      name: 'edit_language_image',
      description: 'Tillarning rasmini tahrirlash',
      user_access: false,
    },
    delete_language: {
      name: 'delete_language',
      description: "Tillarni o'chirish",
      user_access: false,
    },
  },
  translate: {
    get_all_translate: {
      name: 'get_all_translate',
      description: 'Barcha tarjimalarni olish',
      user_access: false,
    },
    get_unused_translate: {
      name: 'get_unused_translate',
      description: 'Ishlatilinmagan tarjimalarni olish',
      user_access: false,
    },
    get_translate: {
      name: 'get_translate',
      description: 'Bir dona tarjimani olish',
      user_access: false,
    },
    get_single_translate_by_code: {
      name: 'get_single_translate_by_code',
      description: "Bir dona tarjimani kodi bo'yicha olish",
      user_access: true,
    },
    create_translate: {
      name: 'create_translate',
      description: 'Yangi tarjima yaratish',
      user_access: false,
    },
    edit_translate: {
      name: 'edit_translate',
      description: 'Tarjimalarni yangilash',
      user_access: false,
    },
    delete_translate: {
      name: 'delete_translate',
      description: "Tarjimani o'chirish",
      user_access: false,
    },
  },
  region: {
    get_all_region: {
      name: 'get_all_region',
      description: 'Barcha viloyatlarni olish',
      user_access: true,
    },
    create_region: {
      name: 'create_region',
      description: 'Yangi viloyat yaratish',
      user_access: false,
    },
    edit_region: {
      name: 'edit_region',
      description: 'Viloyatni tahrirlash',
      user_access: false,
    },
    delete_region: {
      name: 'delete_region',
      description: "Viloyatni o'chirish",
      user_access: false,
    },
  },
  place: {
    delete_place: {
      name: 'delete_place',
      description: "Joylarni o'chirish",
      user_access: false,
    },
    edit_place: {
      name: 'edit_place',
      description: 'Joylarni tahrirlash',
      user_access: false,
    },
    edit_place_image: {
      name: 'edit_place_image',
      description: 'Joylarni rasmini yangilash',
      user_access: false,
    },
    create_place: {
      name: 'create_place',
      description: 'Joylarni yaratish',
      user_access: false,
    },
    get_all_place: {
      name: 'get_all_place',
      description: 'Barcha joylarni olish',
      user_access: true,
    },
    get_all_place_by_region: {
      name: 'get_all_place_by_region',
      description: 'Joylarni viloyati orqali olish',
      user_access: true,
    },
  },
  comfort: {
    get_all_comfort: {
      name: 'get_all_comfort',
      description: 'Barcha qulayliklarni olish',
      user_access: true,
    },
    create_comfort: {
      name: 'create_comfort',
      description: 'Qulaylik yaratish',
      user_access: false,
    },
    edit_comfort: {
      name: 'edit_comfort',
      description: 'Qulayliklarni tahrirlash',
      user_access: false,
    },
    edit_comfort_image: {
      name: 'edit_comfort_image',
      description: 'Qulayliklar rasmini yangilash',
      user_access: false,
    },
    delete_comfort: {
      name: 'delete_comfort',
      description: "Qulayliklarni o'chirish",
      user_access: false,
    },
  },
  cottage: {
    get_all_cottage: {
      name: 'get_all_cottage',
      description: 'Barcha dachalarni olish',
      user_access: true,
    },
    get_all_cottages_by_cottage_type: {
      name: 'get_all_cotteges_by_cottage_type',
      description: 'Barcha dachalarni dacha turiga qarab olish',
      user_access: true,
    },
    get_all_cottages_by_place: {
      name: 'get_all_cotteges_by_place',
      description: 'Barcha dachalarni joylarga qarab olish',
      user_access: true,
    },
    get_all_cottages_by_user: {
      name: 'get_all_cotteges_by_user',
      description: 'Barcha dachalarni user orqali olish',
      user_access: true,
    },
    get_all_cottages_by_user_id: {
      name: 'get_all_cotteges_by_user_id',
      description: 'Barcha dachalarni user id orqali olish',
      user_access: true,
    },
    get_all_filtered_cottages: {
      name: 'get_all_filtered_cottages',
      description: 'Barcha filtrlangan dachalarni olish',
      user_access: true,
    },
    get_all_searched_cottages: {
      name: 'get_all_searched_cottages',
      description: 'Barcha qidirilgan dachalarni olish',
      user_access: true,
    },
    get_all_hotel_sanatorium_waterfall_cottages: {
      name: 'get_all_hotel_sanatorium_waterfall_cottages',
      description: 'Barcha mehmonxona, sharshara, sanatoriyalarni olish',
      user_access: true,
    },
    get_all_suitable_cottages: {
      name: 'get_all_suitable_cottages',
      description: 'Barcha mos dachalarni olish',
      user_access: true,
    },
    get_all_cottages_on_top: {
      name: 'get_all_cottages_on_top',
      description: 'Barcha topdagi dachalarni olish',
      user_access: true,
    },
    get_all_cottages_recommended: {
      name: 'get_all_cottages_recommended',
      description: 'Barcha tavsiya qilingan dachalarni olish',
      user_access: true,
    },
    create_cottage: {
      name: 'create_cottage',
      description: 'Yangi dacha yaratish',
      user_access: true,
    },
    create_premium_cottage: {
      name: 'create_premium_cottage',
      description: "Premium(pullik) dacha qo'shish",
      user_access: false,
    },
    delete_premium_cottage: {
      name: 'delete_premium_cottage',
      description: "Premium dachani o'chirish",
      user_access: false,
    },
    edit_cottage_image: {
      name: 'edit_cottage_image',
      description: 'Dachaning rasmini tahrirlash',
      user_access: true,
    },
    delete_cottage_image: {
      name: 'delete_cottage_image',
      description: "Dachaning rasmini o'chirish",
      user_access: true,
    },
    edit_cottage: {
      name: 'edit_cottage',
      description: 'Dachani tahrirlash',
      user_access: true,
    },
    delete_cottage: {
      name: 'delete_cottage',
      description: "Dachani o'chirish",
      user_access: true,
    },
    create_cottage_image: {
      name: 'create_cottage_image',
      description: 'Dachani rasmini yaratish',
      user_access: true,
    },
  },
  notification: {
    get_all_notification: {
      name: 'get_all_notification',
      description: 'Barcha bilidirishlarni olish',
      user_access: false,
    },
    get_user_notification: {
      name: 'get_user_notification',
      description: 'Foydalanuvchi bildirishlarini olish',
      user_access: true,
    },
    create_notification: {
      name: 'create_notification',
      description: 'Yangi bildirishnoma yaratish',
      user_access: false,
    },
    create_notification_for_all: {
      name: 'create_notification_for_all',
      description: 'Barcha uchun bildirishnoma yaratish',
      user_access: false,
    },
    edit_notification: {
      name: 'edit_notification',
      description: 'Bildirishnomani tahrirlash',
      user_access: false,
    },
    delete_notification: {
      name: 'delete_notification',
      description: "Bildirishnomani o'chirish",
      user_access: false,
    },
  },
  models: {
    get_all_models: {
      name: 'get_all_models',
      description: 'Barcha modellarni olish',
      user_access: false,
    },
    create_models: {
      name: 'create_models',
      description: 'Yangi model yaratish',
      user_access: false,
    },
    edit_models: {
      name: 'edit_models',
      description: 'Modellarni tahrirlash',
      user_access: false,
    },
    delete_models: {
      name: 'delete_models',
      description: "Modellarni o'chirish",
      user_access: false,
    },
  },
  permission: {
    get_all_permission: {
      name: 'get_all_permissions',
      description: 'Barcha ruhsatlarni olish',
      user_access: false,
    },
    create_permission: {
      name: 'create_permission',
      description: 'Yangi ruhsat yaratish',
      user_access: false,
    },
    edit_permission: {
      name: 'edit_permission',
      description: 'Ruhsatlarni yangilash',
      user_access: false,
    },
    delete_permission: {
      name: 'delete_permission',
      description: "Ruhsatlarni o'chirish",
      user_access: false,
    },
  },
  roles: {
    get_all_roles: {
      name: 'get_all_roles',
      description: 'Barcha rollarni olish',
      user_access: false,
    },
    create_roles: {
      name: 'create_roles',
      description: 'Yangi rol yaratish',
      user_access: false,
    },
    edit_roles: {
      name: 'edit_roles',
      description: 'Rollarni tahrirlash',
      user_access: false,
    },
    delete_roles: {
      name: 'delete_roles',
      description: "Rollarni o'chirish",
      user_access: false,
    },
  },
  user: {
    get_all_users: {
      name: 'get_all_users',
      description: 'Barcha foydalanuvchilarni olish',
      user_access: false,
    },
    get_single_user: {
      name: 'get_single_user',
      description: 'Bitta foydalanuvchini olish',
      user_access: true,
    },
    get_single_user_by_userid: {
      name: 'get_single_user_by_userid',
      description: "Bitta foydalanuvchini id'si orqali olish",
      user_access: true,
    },
    get_used_services_of_user: {
      name: 'get_used_services_of_user',
      description: 'Foydalanuvchi foydalangan xizmatlarni olish',
      user_access: true,
    },
    create_users: {
      name: 'create_users',
      description: 'Yangi foydalanuvchi yaratish',
      user_access: false,
    },
    get_all_user_device: {
      name: 'get_all_user_device',
      description: 'Foydalanuvchi qurilmalarini olish',
      user_access: true,
    },
    edit_user: {
      name: 'edit_user',
      description: 'Foydalanuvchini tahrirlash',
      user_access: true,
    },
    delete_user: {
      name: 'delete_user',
      description: "Foydalanuvchini o'chirish",
      user_access: false,
    },
  },
  cottage_type: {
    get_all_cottage_type: {
      name: 'get_all_cottage_type',
      description: 'Barcha dacha turlarini olish',
      user_access: true,
    },
    create_cottage_type: {
      name: 'create_cottage_type',
      description: 'Dacha turini yaratish',
      user_access: false,
    },
    edit_cottage_type: {
      name: 'edit_cottage_type',
      description: 'Dacha turini tahrirlash',
      user_access: false,
    },
    delete_cottage_type: {
      name: 'delete_cottage_type',
      description: "Dacha turini o'chirish",
      user_access: false,
    },
    edit_cottage_type_image: {
      name: 'edit_cottage_type_image',
      description: 'Dacha turining rasmini tahrirlash',
      user_access: false,
    }
  },
  services: {
    get_all_services: {
      name: 'get_all_services',
      description: 'Barcha xizmatlarni olish',
      user_access: true,
    },
    get_single_service: {
      name: 'get_single_service',
      description: 'Bitta xizmatni olish',
      user_access: true,
    },
    create_service: {
      name: 'create_service',
      description: 'Yangi xizmat yaratish',
      user_access: false,
    },
    edit_service: {
      name: 'edit_service',
      description: 'Xizmatlarni tahrirlash',
      user_access: false,
    },
    delete_service: {
      name: 'delete_service',
      description: "Xizmatlarni o'chirish",
      user_access: false,
    },
  },
  tariff: {
    get_all_tariffs: {
      name: 'get_all_tariffs',
      description: 'Barcha tariflarni olish',
      user_access: true,
    },
    get_all_used_tariffs: {
      name: 'get_all_used_tariffs',
      description: 'Barcha foydalanilgan tariflarni olish',
      user_access: true,
    },
    create_tariff: {
      name: 'create_tariff',
      description: 'Yangi tarif yaratish',
      user_access: false,
    },
    activate_tariff: {
      name: 'activate_tariff',
      description: 'Tarifni aktivlashtirish',
      user_access: true,
    },
    edit_tariff: {
      name: 'edit_tariff',
      description: 'Tarifni tahrirlash',
      user_access: false,
    },
    disable_tariff: {
      name: 'disable_tariff',
      description: 'Tarifni disable(faolsizlantirish) qilish',
      user_access: false,
    },
    delete_tariff: {
      name: 'delete_tariff',
      description: "Tarifni o'chirish",
      user_access: false,
    },
  },
  order: {
    get_all_users_orders_for_admin: {
      name: 'get_all_users_orders_for_admin',
      description: 'Barcha foydalanuvchilar buyurtmalarini olish(admin uchun)',
      user_access: false,
    },
    get_all_user_orders: {
      name: 'get_all_user_orders',
      description: 'Barcha foydalanuvchi buyurtmalarini olish',
      user_access: true,
    },
    create_order: {
      name: 'create_order',
      description: 'Yangi buyurtma yaratish',
      user_access: true,
    },
    update_order: {
      name: 'update_order',
      description: 'Buyurtmani tahrirlash',
      user_access: true,
    },
    delete_order: {
      name: 'delete_order',
      description: "Buyurtmani o'chirish",
      user_access: false,
    },
  },
};
