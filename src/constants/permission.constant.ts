export const PERMISSIONS = {
  language: {
    get_all_language: {
      name: 'get_all_language',
      description: 'Barcha tillarni olish',
    },
    create_language: {
      name: 'create_language',
      description: 'Yangi til yaratish',
    },
    edit_language: {
      name: 'edit_language',
      description: 'Tillarni tahrirlash',
    },
    edit_language_image: {
      name: 'edit_language_image',
      description: 'Tillarning rasmini tahrirlash',
    },
    delete_language: {
      name: 'delete_language',
      description: "Tillarni o'chirish",
    },
  },
  translate: {
    get_all_translate: {
      name: 'get_all_translate',
      description: 'Barcha tarjimalarni olish',
    },
    get_unused_translate: {
      name: 'get_unused_translate',
      description: 'Ishlatilinmagan tarjimalarni olish',
    },
    get_translate: {
      name: 'get_translate',
      description: 'Bir dona tarjimani olish',
    },
    get_single_translate_by_code: {
      name: 'get_single_translate_by_code',
      description: "Bir dona tarjimani kodi bo'yicha olish",
    },
    create_translate: {
      name: 'create_translate',
      description: 'Yangi tarjima yaratish',
    },
    edit_translate: {
      name: 'edit_translate',
      description: 'Tarjimalarni yangilash',
    },
    delete_translate: {
      name: 'delete_translate',
      description: "Tarjimani o'chirish",
    },
  },
  region: {
    get_all_region: {
      name: 'get_all_region',
      description: 'Barcha viloyatlarni olish',
    },
    create_region: {
      name: 'create_region',
      description: 'Yangi viloyat yaratish',
    },
    edit_region: {
      name: 'edit_region',
      description: 'Viloyatni tahrirlash',
    },
    delete_region: {
      name: 'delete_region',
      description: "Viloyatni o'chirish",
    },
  },
  place: {
    delete_place: {
      name: 'delete_place',
      description: "Joylarni o'chirish",
    },
    edit_place: {
      name: 'edit_place',
      description: 'Joylarni tahrirlash',
    },
    edit_place_image: {
      name: 'edit_place_image',
      description: 'Joylarni rasmini yangilash',
    },
    create_place: {
      name: 'create_place',
      description: 'Joylarni yaratish',
    },
    get_all_place: {
      name: 'get_all_place',
      description: 'Barcha joylarni olish',
    },
    get_all_place_by_region: {
      name: 'get_all_place_by_region',
      description: 'Joylarni viloyati orqali olish',
    },
  },
  comfort: {
    get_all_comfort: {
      name: 'get_all_comfort',
      description: 'Barcha qulayliklarni olish',
    },
    create_comfort: {
      name: 'create_comfort',
      description: 'Qulaylik yaratish',
    },
    edit_comfort: {
      name: 'edit_comfort',
      description: 'Qulayliklarni tahrirlash',
    },
    edit_comfort_image: {
      name: 'edit_comfort_image',
      description: 'Qulayliklar rasmini yangilash',
    },
    delete_comfort: {
      name: 'delete_comfort',
      description: "Qulayliklarni o'chirish",
    },
  },
  cottage: {
    get_all_cottage: {
      name: 'get_all_cottage',
      description: 'Barcha dachalarni olish',
    },
    get_all_cottages_by_cottage_type: {
      name: 'get_all_cotteges_by_cottage_type',
      description: 'Barcha dachalarni dacha turiga qarab olish',
    },
    get_all_cottages_by_place: {
      name: 'get_all_cotteges_by_place',
      description: 'Barcha dachalarni joylarga qarab olish',
    },
    get_all_cottages_by_user: {
      name: 'get_all_cotteges_by_user',
      description: 'Barcha dachalarni user orqali olish',
    },
    get_all_cottages_by_user_id: {
      name: 'get_all_cotteges_by_user_id',
      description: 'Barcha dachalarni user id orqali olish',
    },
    get_all_filtered_cottages: {
      name: 'get_all_filtered_cottages',
      description: 'Barcha filtrlangan dachalarni olish',
    },
    get_all_suitable_cottages: {
      name: 'get_all_suitable_cottages',
      description: 'Barcha mos dachalarni olish',
    },
    get_all_cottages_on_top: {
      name: 'get_all_cottages_on_top',
      description: 'Barcha topdagi dachalarni olish',
    },
    get_all_cottages_recommended: {
      name: 'get_all_cottages_recommended',
      description: 'Barcha tavsiya qilingan dachalarni olish',
    },
    create_cottage: {
      name: 'create_cottage',
      description: 'Yangi dacha yaratish',
    },
    create_premium_cottage: {
      name: 'create_premium_cottage',
      description: "Premium(pullik) dacha qo'shish",
    },
    delete_premium_cottage: {
      name: 'delete_premium_cottage',
      description: "Premium dachani o'chirish",
    },
    edit_cottage_image: {
      name: 'edit_cottage_image',
      description: 'Dachaning rasmini tahrirlash',
    },
    delete_cottage_image: {
      name: 'delete_cottage_image',
      description: "Dachaning rasmini o'chirish",
    },
    edit_cottage: {
      name: 'edit_cottage',
      description: 'Dachani tahrirlash',
    },
    delete_cottage: {
      name: 'delete_cottage',
      description: "Dachani o'chirish",
    },
    create_cottage_image: {
      name: 'create_cottage_image',
      description: 'Dachani rasmini yaratish',
    },
  },
  notification: {
    get_all_notification: {
      name: 'get_all_notification',
      description: 'Barcha bilidirishlarni olish',
    },
    get_user_notification: {
      name: 'get_user_notification',
      description: 'Foydalanuvchi bildirishlarini olish',
    },
    create_notification: {
      name: 'create_notification',
      description: 'Yangi bildirishnoma yaratish',
    },
    create_notification_for_all: {
      name: 'create_notification_for_all',
      description: 'Barcha uchun bildirishnoma yaratish',
    },
    edit_notification: {
      name: 'edit_notification',
      description: 'Bildirishnomani tahrirlash',
    },
    delete_notification: {
      name: 'delete_notification',
      description: "Bildirishnomani o'chirish",
    },
  },
  models: {
    get_all_models: {
      name: 'get_all_models',
      description: 'Barcha modellarni olish',
    },
    create_models: {
      name: 'create_models',
      description: 'Yangi model yaratish',
    },
    edit_models: {
      name: 'edit_models',
      description: 'Modellarni tahrirlash',
    },
    delete_models: {
      name: 'delete_models',
      description: "Modellarni o'chirish",
    },
  },
  permission: {
    get_all_permission: {
      name: 'get_all_permissions',
      description: 'Barcha ruhsatlarni olish',
    },
    create_permission: {
      name: 'create_permission',
      description: 'Yangi ruhsat yaratish',
    },
    edit_permission: {
      name: 'edit_permission',
      description: 'Ruhsatlarni yangilash',
    },
    delete_permission: {
      name: 'delete_permission',
      description: "Ruhsatlarni o'chirish",
    },
  },
  roles: {
    get_all_roles: {
      name: 'get_all_roles',
      description: 'Barcha rollarni olish',
    },
    create_roles: {
      name: 'create_roles',
      description: 'Yangi rol yaratish',
    },
    edit_roles: {
      name: 'edit_roles',
      description: 'Rollarni tahrirlash',
    },
    delete_roles: {
      name: 'delete_roles',
      description: "Rollarni o'chirish",
    },
  },
  user: {
    get_all_users: {
      name: 'get_all_users',
      description: 'Barcha foydalanuvchilarni olish',
    },
    get_single_user: {
      name: 'get_single_user',
      description: 'Bitta foydalanuvchini olish',
    },
    get_single_user_by_userid: {
      name: 'get_single_user_by_userid',
      description: "Bitta foydalanuvchini id'si orqali olish",
    },
    get_used_services_of_user: {
      name: 'get_used_services_of_user',
      description: 'Foydalanuvchi foydalangan xizmatlarni olish',
    },
    create_users: {
      name: 'create_users',
      description: 'Yangi foydalanuvchi yaratish',
    },
    get_all_user_device: {
      name: 'get_all_user_device',
      description: 'Foydalanuvchi qurilmalarini olish',
    },
    edit_user: {
      name: 'edit_user',
      description: 'Foydalanuvchini tahrirlash',
    },
    delete_user: {
      name: 'delete_user',
      description: "Foydalanuvchini o'chirish",
    },
  },
  cottage_type: {
    get_all_cottage_type: {
      name: 'get_all_cottage_type',
      description: 'Barcha dacha turlarini olish',
    },
    create_cottage_type: {
      name: 'create_cottage_type',
      description: 'Dacha turini yaratish',
    },
    edit_cottage_type: {
      name: 'edit_cottage_type',
      description: 'Dacha turini tahrirlash',
    },
    delete_cottage_type: {
      name: 'delete_cottage_type',
      description: "Dacha turini o'chirish",
    },
  },
  services: {
    get_all_services: {
      name: 'get_all_services',
      description: 'Barcha xizmatlarni olish',
    },
    get_single_service: {
      name: 'get_single_service',
      description: 'Bitta xizmatni olish',
    },
    create_service: {
      name: 'create_service',
      description: 'Yangi xizmat yaratish',
    },
    edit_service: {
      name: 'edit_service',
      description: 'Xizmatlarni tahrirlash',
    },
    delete_service: {
      name: 'delete_service',
      description: "Xizmatlarni o'chirish",
    },
  },
  tariff: {
    get_all_tariffs: {
      name: 'get_all_tariffs',
      description: 'Barcha tariflarni olish',
    },
    get_all_used_tariffs: {
      name: 'get_all_used_tariffs',
      description: 'Barcha foydalanilgan tariflarni olish',
    },
    create_tariff: {
      name: 'create_tariff',
      description: 'Yangi tarif yaratish',
    },
    activate_tariff: {
      name: 'activate_tariff',
      description: 'Tarifni aktivlashtirish',
    },
    edit_tariff: {
      name: 'edit_tariff',
      description: 'Tarifni tahrirlash',
    },
    disable_tariff: {
      name: 'disable_tariff',
      description: 'Tarifni disable(faolsizlantirish) qilish',
    },
    delete_tariff: {
      name: 'delete_tariff',
      description: "Tarifni o'chirish",
    },
  },
  order: {
    get_all_users_orders_for_admin: {
      name: 'get_all_users_orders_for_admin',
      description: 'Barcha foydalanuvchilar buyurtmalarini olish(admin uchun)',
    },
    get_all_user_orders: {
      name: 'get_all_user_orders',
      description: 'Barcha foydalanuvchi buyurtmalarini olish',
    },
    create_order: {
      name: 'create_order',
      description: 'Yangi buyurtma yaratish',
    },
    update_order: {
      name: 'update_order',
      description: 'Buyurtmani tahrirlash',
    },
    delete_order: {
      name: 'delete_order',
      description: "Buyurtmani o'chirish",
    },
  },
};
