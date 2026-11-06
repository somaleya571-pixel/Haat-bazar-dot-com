/**
 * Bangladesh Administrative Hierarchy: Districts, Upazilas, Thanas
 * Dedicated to Page 07 & Page 08 with cascading dependency and independent search
 */

export interface LocationHierarchy {
  [district: string]: {
    [upazila: string]: string[]; // Thanas
  };
}

export const BANGLADESH_LOCATIONS: LocationHierarchy = {
  Dhaka: {
    Dhanmondi: ['Dhanmondi Thana', 'Kalabagan Thana', 'New Market Thana'],
    Gulshan: ['Gulshan Thana', 'Banani Thana', 'Baridhara Thana'],
    Mirpur: ['Mirpur Model Thana', 'Pallabi Thana', 'Kafrul Thana', 'Shah Ali Thana'],
    Uttara: ['Uttara East Thana', 'Uttara West Thana', 'Turag Thana'],
    Mohammadpur: ['Mohammadpur Thana', 'Adabor Thana'],
    Motijheel: ['Motijheel Thana', 'Paltan Thana', 'Shahbagh Thana'],
    Savar: ['Savar Model Thana', 'Ashulia Thana'],
    Keraniganj: ['Keraniganj Model Thana', 'South Keraniganj Thana'],
    Dhamrai: ['Dhamrai Thana'],
    Nawabganj: ['Nawabganj Thana'],
  },
  Chittagong: {
    Panchlaish: ['Panchlaish Thana', 'Chawkbazar Thana', 'Chandgaon Thana'],
    Kotwali: ['Kotwali Thana', 'Bakalia Thana'],
    DoubleMooring: ['Double Mooring Thana', 'Halishahar Thana'],
    Hathazari: ['Hathazari Model Thana'],
    Sitakunda: ['Sitakunda Thana'],
    Patiya: ['Patiya Thana'],
    Rangunia: ['Rangunia Thana'],
    Boalkhali: ['Boalkhali Thana'],
    Anwara: ['Anwara Thana'],
  },
  Sylhet: {
    SylhetSadar: ['Kotwali Thana', 'Jalalabad Thana', 'Airport Thana', 'Moglabazar Thana'],
    Beanibazar: ['Beanibazar Thana'],
    Golapganj: ['Golapganj Thana'],
    Gowainghat: ['Gowainghat Thana'],
    Kanaighat: ['Kanaighat Thana'],
    Fenchuganj: ['Fenchuganj Thana'],
    Zakiganj: ['Zakiganj Thana'],
  },
  Rajshahi: {
    Boalia: ['Boalia Model Thana'],
    Rajpara: ['Rajpara Thana'],
    Motihar: ['Motihar Thana'],
    ShahMakhdum: ['Shah Makhdum Thana'],
    Paba: ['Paba Thana'],
    Godagari: ['Godagari Thana'],
    Bagmara: ['Bagmara Thana'],
    Tanore: ['Tanore Thana'],
  },
  Khulna: {
    KhulnaSadar: ['Kotwali Thana', 'Sonadanga Thana', 'Khalishpur Thana', 'Daulatpur Thana'],
    Dumuria: ['Dumuria Thana'],
    Rupsha: ['Rupsha Thana'],
    Phultala: ['Phultala Thana'],
    Batiaghata: ['Batiaghata Thana'],
    Paikgachha: ['Paikgachha Thana'],
  },
  Barishal: {
    BarishalSadar: ['Kotwali Model Thana', 'Airport Thana', 'Kawnia Thana'],
    Babuganj: ['Babuganj Thana'],
    Bakerganj: ['Bakerganj Thana'],
    Gournadi: ['Gournadi Thana'],
    Mehendiganj: ['Mehendiganj Thana'],
  },
  Rangpur: {
    RangpurSadar: ['Kotwali Thana', 'Tajhat Thana', 'Mahiganj Thana', 'Haragach Thana'],
    Badarganj: ['Badarganj Thana'],
    Pirganj: ['Pirganj Thana'],
    Mithapukur: ['Mithapukur Thana'],
    Gangachara: ['Gangachara Thana'],
  },
  Mymensingh: {
    MymensinghSadar: ['Kotwali Model Thana'],
    Muktagachha: ['Muktagachha Thana'],
    Trishal: ['Trishal Thana'],
    Bhaluka: ['Bhaluka Thana'],
    Gafargaon: ['Gafargaon Thana'],
  },
  Cumilla: {
    CumillaAdarshaSadar: ['Kotwali Model Thana'],
    CumillaSadarDakshin: ['Sadar Dakshin Thana'],
    Laksam: ['Laksam Thana'],
    Debidwar: ['Debidwar Thana'],
    Chandina: ['Chandina Thana'],
    Muradnagar: ['Muradnagar Thana'],
  },
  Gazipur: {
    Joydebpur: ['Joydebpur Thana', 'Sadar Thana'],
    Tongi: ['Tongi East Thana', 'Tongi West Thana'],
    Kaliakair: ['Kaliakair Thana'],
    Sreepur: ['Sreepur Thana'],
    Kapasia: ['Kapasia Thana'],
  },
  Narayanganj: {
    NarayanganjSadar: ['Narayanganj Sadar Thana', 'Fatullah Thana'],
    Bandar: ['Bandar Thana'],
    Rupganj: ['Rupganj Thana'],
    Sonargaon: ['Sonargaon Thana'],
    Araihazar: ['Araihazar Thana'],
  },
  Bogura: {
    BoguraSadar: ['Bogura Sadar Thana'],
    Shajahanpur: ['Shajahanpur Thana'],
    Sherpur: ['Sherpur Thana'],
    Gabtali: ['Gabtali Thana'],
    Shibganj: ['Shibganj Thana'],
  },
};

export function getDistricts(): string[] {
  return Object.keys(BANGLADESH_LOCATIONS).sort();
}

export function getUpazilas(district: string): string[] {
  if (!district || !BANGLADESH_LOCATIONS[district]) return [];
  return Object.keys(BANGLADESH_LOCATIONS[district]).sort();
}

export function getThanas(district: string, upazila: string): string[] {
  if (!district || !upazila || !BANGLADESH_LOCATIONS[district]) return [];
  return (BANGLADESH_LOCATIONS[district][upazila] || []).slice().sort();
}

export interface AddressPayload {
  district: string;
  upazila: string;
  thana: string;
  village: string;
  addressDetails: string;
  recipientName?: string;
  phone?: string;
}

export function validateDeliveryAddress(addr: Partial<AddressPayload>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!addr.district || addr.district.trim() === '') {
    errors.district = 'জেলা নির্বাচন আবশ্যক (District is mandatory)';
  } else if (!BANGLADESH_LOCATIONS[addr.district]) {
    errors.district = 'অকার্যকর জেলা নির্বাচন (Invalid District)';
  }

  if (!addr.upazila || addr.upazila.trim() === '') {
    errors.upazila = 'উপজেলা নির্বাচন আবশ্যক (Upazila is mandatory)';
  } else if (addr.district && BANGLADESH_LOCATIONS[addr.district] && !BANGLADESH_LOCATIONS[addr.district][addr.upazila]) {
    errors.upazila = 'নির্বাচিত জেলার সাথে উপজেলা মেলেনি (Upazila does not belong to district)';
  }

  if (!addr.thana || addr.thana.trim() === '') {
    errors.thana = 'থানা নির্বাচন আবশ্যক (Thana is mandatory)';
  }

  if (!addr.village || addr.village.trim().length < 2) {
    errors.village = 'গ্রামের নাম আবশ্যক (Village name is mandatory, min 2 chars)';
  }

  if (!addr.addressDetails || addr.addressDetails.trim().length < 5) {
    errors.addressDetails = 'বিস্তারিত ঠিকানা প্রদান করুন (Detailed address is mandatory, min 5 chars)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
