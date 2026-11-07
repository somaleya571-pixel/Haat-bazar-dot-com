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
  // Dhaka Division
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
    Dohar: ['Dohar Thana'],
  },
  Gazipur: {
    Joydebpur: ['Joydebpur Thana', 'Sadar Thana'],
    Tongi: ['Tongi East Thana', 'Tongi West Thana'],
    Kaliakair: ['Kaliakair Thana'],
    Sreepur: ['Sreepur Thana'],
    Kapasia: ['Kapasia Thana'],
    Kaliganj: ['Kaliganj Thana'],
  },
  Narayanganj: {
    NarayanganjSadar: ['Narayanganj Sadar Thana', 'Fatullah Thana', 'Siddhirganj Thana'],
    Bandar: ['Bandar Thana'],
    Rupganj: ['Rupganj Thana'],
    Sonargaon: ['Sonargaon Thana'],
    Araihazar: ['Araihazar Thana'],
  },
  Tangail: {
    TangailSadar: ['Tangail Sadar Thana'],
    Mirzapur: ['Mirzapur Thana'],
    Gopalpur: ['Gopalpur Thana'],
    Madhupur: ['Madhupur Thana'],
    Ghatail: ['Ghatail Thana'],
    Kalihati: ['Kalihati Thana'],
    Sakhipur: ['Sakhipur Thana'],
    Delduar: ['Delduar Thana'],
  },
  Kishoreganj: {
    KishoreganjSadar: ['Kishoreganj Sadar Thana'],
    Bhairab: ['Bhairab Thana'],
    Bajitpur: ['Bajitpur Thana'],
    Katiadi: ['Katiadi Thana'],
    Karimganj: ['Karimganj Thana'],
    Pakundia: ['Pakundia Thana'],
  },
  Manikganj: {
    ManikganjSadar: ['Manikganj Sadar Thana'],
    Singair: ['Singair Thana'],
    Saturia: ['Saturia Thana'],
    Shibalaya: ['Shibalaya Thana'],
    Harirampur: ['Harirampur Thana'],
  },
  Munshiganj: {
    MunshiganjSadar: ['Munshiganj Sadar Thana'],
    Sreenagar: ['Sreenagar Thana'],
    Sirajdikhan: ['Sirajdikhan Thana'],
    Louhajang: ['Louhajang Thana'],
    Gazaria: ['Gazaria Thana'],
  },
  Narsingdi: {
    NarsingdiSadar: ['Narsingdi Sadar Thana'],
    Palash: ['Palash Thana'],
    Shibpur: ['Shibpur Thana'],
    Raipura: ['Raipura Thana'],
    Belabo: ['Belabo Thana'],
    Monohardi: ['Monohardi Thana'],
  },
  Faridpur: {
    FaridpurSadar: ['Kotwali Thana'],
    Bhanga: ['Bhanga Thana'],
    Boalmari: ['Boalmari Thana'],
    Madhukhali: ['Madhukhali Thana'],
    Nagarkanda: ['Nagarkanda Thana'],
    Sadarpur: ['Sadarpur Thana'],
  },
  Gopalganj: {
    GopalganjSadar: ['Gopalganj Sadar Thana'],
    Kashiani: ['Kashiani Thana'],
    Kotalipara: ['Kotalipara Thana'],
    Muksudpur: ['Muksudpur Thana'],
    Tungipara: ['Tungipara Thana'],
  },
  Madaripur: {
    MadaripurSadar: ['Madaripur Sadar Thana'],
    Shibchar: ['Shibchar Thana'],
    Kalkini: ['Kalkini Thana'],
    Rajoir: ['Rajoir Thana'],
  },
  Rajbari: {
    RajbariSadar: ['Rajbari Sadar Thana'],
    Goalanda: ['Goalanda Ghat Thana'],
    Pangsha: ['Pangsha Thana'],
    Baliakandi: ['Baliakandi Thana'],
  },
  Shariatpur: {
    ShariatpurSadar: ['Palong Thana'],
    Naria: ['Naria Thana'],
    Zajira: ['Zajira Thana'],
    Damudya: ['Damudya Thana'],
    Bhedarganj: ['Bhedarganj Thana'],
    Gosairhat: ['Gosairhat Thana'],
  },

  // Chittagong Division
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
    Mirsharai: ['Mirsharai Thana'],
  },
  CoxsBazar: {
    CoxsBazarSadar: ['Coxs Bazar Sadar Thana'],
    Teknaf: ['Teknaf Thana'],
    Ukhia: ['Ukhia Thana'],
    Chakaria: ['Chakaria Thana'],
    Ramu: ['Ramu Thana'],
    Maheshkhali: ['Maheshkhali Thana'],
    Kutubdia: ['Kutubdia Thana'],
    Pekua: ['Pekua Thana'],
  },
  Cumilla: {
    CumillaAdarshaSadar: ['Kotwali Model Thana'],
    CumillaSadarDakshin: ['Sadar Dakshin Thana'],
    Laksam: ['Laksam Thana'],
    Debidwar: ['Debidwar Thana'],
    Chandina: ['Chandina Thana'],
    Muradnagar: ['Muradnagar Thana'],
    Daudkandi: ['Daudkandi Thana'],
    Barura: ['Barura Thana'],
    Burichang: ['Burichang Thana'],
  },
  Feni: {
    FeniSadar: ['Feni Sadar Thana'],
    Daganbhuiyan: ['Daganbhuiyan Thana'],
    Chhagalnaiya: ['Chhagalnaiya Thana'],
    Sonagazi: ['Sonagazi Thana'],
    Parshuram: ['Parshuram Thana'],
    Fulgazi: ['Fulgazi Thana'],
  },
  Brahmanbaria: {
    BrahmanbariaSadar: ['Brahmanbaria Sadar Thana'],
    Ashuganj: ['Ashuganj Thana'],
    Sarail: ['Sarail Thana'],
    Kasba: ['Kasba Thana'],
    Akhaura: ['Akhaura Thana'],
    Nabinagar: ['Nabinagar Thana'],
    Bancharampur: ['Bancharampur Thana'],
  },
  Noakhali: {
    NoakhaliSadar: ['Sudharam Thana'],
    Begumganj: ['Begumganj Thana'],
    Chatkhil: ['Chatkhil Thana'],
    Companiganj: ['Companiganj Thana'],
    Hatiya: ['Hatiya Thana'],
    Senbagh: ['Senbagh Thana'],
    Subarnachar: ['Char Jabbar Thana'],
  },
  Chandpur: {
    ChandpurSadar: ['Chandpur Sadar Thana'],
    Hajiganj: ['Hajiganj Thana'],
    MatlabDakshin: ['Matlab Dakshin Thana'],
    MatlabUttar: ['Matlab Uttar Thana'],
    Faridganj: ['Faridganj Thana'],
    Shahrasti: ['Shahrasti Thana'],
    Kachua: ['Kachua Thana'],
  },
  Lakshmipur: {
    LakshmipurSadar: ['Lakshmipur Sadar Thana'],
    Raipur: ['Raipur Thana'],
    Ramganj: ['Ramganj Thana'],
    Ramgati: ['Ramgati Thana'],
    Kamalnagar: ['Kamalnagar Thana'],
  },
  Bandarban: {
    BandarbanSadar: ['Bandarban Sadar Thana'],
    Rowangchhari: ['Rowangchhari Thana'],
    Ruma: ['Ruma Thana'],
    Thanchi: ['Thanchi Thana'],
    Lama: ['Lama Thana'],
    AliKadam: ['Ali Kadam Thana'],
  },
  Khagrachhari: {
    KhagrachhariSadar: ['Khagrachhari Sadar Thana'],
    Dighinala: ['Dighinala Thana'],
    Panchhari: ['Panchhari Thana'],
    Mahalchhari: ['Mahalchhari Thana'],
    Ramgarh: ['Ramgarh Thana'],
    Matiranga: ['Matiranga Thana'],
  },
  Rangamati: {
    RangamatiSadar: ['Kotwali Thana'],
    Kaptai: ['Kaptai Thana'],
    Kawkhali: ['Kawkhali Thana'],
    Baghaichhari: ['Baghaichhari Thana'],
    Barkal: ['Barkal Thana'],
    Langadu: ['Langadu Thana'],
  },

  // Rajshahi Division
  Rajshahi: {
    Boalia: ['Boalia Model Thana'],
    Rajpara: ['Rajpara Thana'],
    Motihar: ['Motihar Thana'],
    ShahMakhdum: ['Shah Makhdum Thana'],
    Paba: ['Paba Thana'],
    Godagari: ['Godagari Thana'],
    Bagmara: ['Bagmara Thana'],
    Tanore: ['Tanore Thana'],
    Charghat: ['Charghat Thana'],
    Bagha: ['Bagha Thana'],
  },
  Bogura: {
    BoguraSadar: ['Bogura Sadar Thana'],
    Shajahanpur: ['Shajahanpur Thana'],
    Sherpur: ['Sherpur Thana'],
    Gabtali: ['Gabtali Thana'],
    Shibganj: ['Shibganj Thana'],
    Kahaloo: ['Kahaloo Thana'],
    Nandigram: ['Nandigram Thana'],
    Dhunat: ['Dhunat Thana'],
  },
  Pabna: {
    PabnaSadar: ['Pabna Sadar Thana'],
    Ishwardi: ['Ishwardi Thana'],
    Santhia: ['Santhia Thana'],
    Chatmohar: ['Chatmohar Thana'],
    Bera: ['Bera Thana'],
    Sujanagar: ['Sujanagar Thana'],
    FaridpurPabna: ['Faridpur Thana'],
  },
  Sirajganj: {
    SirajganjSadar: ['Sirajganj Sadar Thana'],
    Shahjadpur: ['Shahjadpur Thana'],
    Ullahpara: ['Ullahpara Thana'],
    Belkuchi: ['Belkuchi Thana'],
    Kazipur: ['Kazipur Thana'],
    Kamarkhanda: ['Kamarkhanda Thana'],
  },
  Natore: {
    NatoreSadar: ['Natore Sadar Thana'],
    Singra: ['Singra Thana'],
    Baraigram: ['Baraigram Thana'],
    Gurudaspur: ['Gurudaspur Thana'],
    Lalpur: ['Lalpur Thana'],
    Bagatipara: ['Bagatipara Thana'],
  },
  Naogaon: {
    NaogaonSadar: ['Naogaon Sadar Thana'],
    Manda: ['Manda Thana'],
    Mohadevpur: ['Mohadevpur Thana'],
    Patnitala: ['Patnitala Thana'],
    Badalgachhi: ['Badalgachhi Thana'],
    Sapahar: ['Sapahar Thana'],
    Niamatpur: ['Niamatpur Thana'],
  },
  ChapaiNawabganj: {
    ChapaiNawabganjSadar: ['Chapai Nawabganj Sadar Thana'],
    ShibganjChapai: ['Shibganj Thana'],
    Gomastapur: ['Gomastapur Thana'],
    Nachole: ['Nachole Thana'],
    Bholahat: ['Bholahat Thana'],
  },
  Joypurhat: {
    JoypurhatSadar: ['Joypurhat Sadar Thana'],
    Panchbibi: ['Panchbibi Thana'],
    Kalai: ['Kalai Thana'],
    Khetlal: ['Khetlal Thana'],
    Akkelpur: ['Akkelpur Thana'],
  },

  // Khulna Division
  Khulna: {
    KhulnaSadar: ['Kotwali Thana', 'Sonadanga Thana', 'Khalishpur Thana', 'Daulatpur Thana'],
    Dumuria: ['Dumuria Thana'],
    Rupsha: ['Rupsha Thana'],
    Phultala: ['Phultala Thana'],
    Batiaghata: ['Batiaghata Thana'],
    Paikgachha: ['Paikgachha Thana'],
    Koyra: ['Koyra Thana'],
    Terokhada: ['Terokhada Thana'],
  },
  Jessore: {
    KotwaliJessore: ['Kotwali Model Thana'],
    Jhikargachha: ['Jhikargachha Thana'],
    Sharsha: ['Sharsha Thana', 'Benapole Port Thana'],
    Manirampur: ['Manirampur Thana'],
    Abhaynagar: ['Abhaynagar Thana'],
    Bagherpara: ['Bagherpara Thana'],
    Chaugachha: ['Chaugachha Thana'],
    Keshabpur: ['Keshabpur Thana'],
  },
  Satkhira: {
    SatkhiraSadar: ['Satkhira Sadar Thana'],
    Kalaroa: ['Kalaroa Thana'],
    Tala: ['Tala Thana'],
    KaliganjSatkhira: ['Kaliganj Thana'],
    Shyamnagar: ['Shyamnagar Thana'],
    Assasuni: ['Assasuni Thana'],
    Debhata: ['Debhata Thana'],
  },
  Jhenaidah: {
    JhenaidahSadar: ['Jhenaidah Sadar Thana'],
    KaliganjJhenaidah: ['Kaliganj Thana'],
    Kotchandpur: ['Kotchandpur Thana'],
    Maheshpur: ['Maheshpur Thana'],
    Shailkupa: ['Shailkupa Thana'],
    Harinakundu: ['Harinakundu Thana'],
  },
  Magura: {
    MaguraSadar: ['Magura Sadar Thana'],
    SreepurMagura: ['Sreepur Thana'],
    Shalikha: ['Shalikha Thana'],
    MohammadpurMagura: ['Mohammadpur Thana'],
  },
  Narail: {
    NarailSadar: ['Narail Sadar Thana'],
    Lohagara: ['Lohagara Thana'],
    Kalia: ['Kalia Thana'],
  },
  Kushtia: {
    KushtiaSadar: ['Kushtia Sadar Thana'],
    Kumarkhali: ['Kumarkhali Thana'],
    MirpurKushtia: ['Mirpur Thana'],
    Bheramara: ['Bheramara Thana'],
    DaulatpurKushtia: ['Daulatpur Thana'],
    Khoksa: ['Khoksa Thana'],
  },
  Chuadanga: {
    ChuadangaSadar: ['Chuadanga Sadar Thana'],
    Alamdanga: ['Alamdanga Thana'],
    Damurhuda: ['Damurhuda Thana'],
    Jibannagar: ['Jibannagar Thana'],
  },
  Meherpur: {
    MeherpurSadar: ['Meherpur Sadar Thana'],
    Gangni: ['Gangni Thana'],
    Mujibnagar: ['Mujibnagar Thana'],
  },
  Bagerhat: {
    BagerhatSadar: ['Bagerhat Sadar Thana'],
    Mongla: ['Mongla Port Thana'],
    Morrelganj: ['Morrelganj Thana'],
    Sarankhola: ['Sarankhola Thana'],
    Rampal: ['Rampal Thana'],
    Fakirhat: ['Fakirhat Thana'],
    KachuaBagerhat: ['Kachua Thana'],
  },

  // Barishal Division
  Barishal: {
    BarishalSadar: ['Kotwali Model Thana', 'Airport Thana', 'Kawnia Thana'],
    Babuganj: ['Babuganj Thana'],
    Bakerganj: ['Bakerganj Thana'],
    Gournadi: ['Gournadi Thana'],
    Mehendiganj: ['Mehendiganj Thana'],
    Wazirpur: ['Wazirpur Thana'],
    Banaripara: ['Banaripara Thana'],
    Muladi: ['Muladi Thana'],
  },
  Barguna: {
    BargunaSadar: ['Barguna Sadar Thana'],
    Amtali: ['Amtali Thana'],
    Patharghata: ['Patharghata Thana'],
    Betagi: ['Betagi Thana'],
    Bamna: ['Bamna Thana'],
    Taltali: ['Taltali Thana'],
  },
  Bhola: {
    BholaSadar: ['Bhola Sadar Thana'],
    Daulatkhan: ['Daulatkhan Thana'],
    Borhanuddin: ['Borhanuddin Thana'],
    Lalmohan: ['Lalmohan Thana'],
    CharFasson: ['Char Fasson Thana'],
    Monpura: ['Monpura Thana'],
    Tazumuddin: ['Tazumuddin Thana'],
  },
  Jhalokati: {
    JhalokatiSadar: ['Jhalokati Sadar Thana'],
    Nalchity: ['Nalchity Thana'],
    Rajapur: ['Rajapur Thana'],
    Kathalia: ['Kathalia Thana'],
  },
  Patuakhali: {
    PatuakhaliSadar: ['Patuakhali Sadar Thana'],
    Galachipa: ['Galachipa Thana'],
    Kalapara: ['Kalapara Thana'],
    Bauphal: ['Bauphal Thana'],
    Dashmina: ['Dashmina Thana'],
    Mirzaganj: ['Mirzaganj Thana'],
  },
  Pirojpur: {
    PirojpurSadar: ['Pirojpur Sadar Thana'],
    Bhandaria: ['Bhandaria Thana'],
    Mathbaria: ['Mathbaria Thana'],
    Nazirpur: ['Nazirpur Thana'],
    KawkhaliPirojpur: ['Kawkhali Thana'],
    Nesarabad: ['Nesarabad Thana'],
  },

  // Sylhet Division
  Sylhet: {
    SylhetSadar: ['Kotwali Thana', 'Jalalabad Thana', 'Airport Thana', 'Moglabazar Thana'],
    Beanibazar: ['Beanibazar Thana'],
    Golapganj: ['Golapganj Thana'],
    Gowainghat: ['Gowainghat Thana'],
    Kanaighat: ['Kanaighat Thana'],
    Fenchuganj: ['Fenchuganj Thana'],
    Zakiganj: ['Zakiganj Thana'],
    OsmaniNagar: ['Osmani Nagar Thana'],
    Biswanath: ['Biswanath Thana'],
  },
  Moulvibazar: {
    MoulvibazarSadar: ['Moulvibazar Sadar Thana'],
    Sreemangal: ['Sreemangal Thana'],
    Kulaura: ['Kulaura Thana'],
    Kamalganj: ['Kamalganj Thana'],
    Barlekha: ['Barlekha Thana'],
    Rajnagar: ['Rajnagar Thana'],
    Juri: ['Juri Thana'],
  },
  Habiganj: {
    HabiganjSadar: ['Habiganj Sadar Thana'],
    Madhabpur: ['Madhabpur Thana'],
    Nabiganj: ['Nabiganj Thana'],
    Chunarughat: ['Chunarughat Thana'],
    Bahubal: ['Bahubal Thana'],
    Baniachong: ['Baniachong Thana'],
    Ajmiriganj: ['Ajmiriganj Thana'],
  },
  Sunamganj: {
    SunamganjSadar: ['Sunamganj Sadar Thana'],
    Chhatak: ['Chhatak Thana'],
    Jagannathpur: ['Jagannathpur Thana'],
    Tahirpur: ['Tahirpur Thana'],
    Derai: ['Derai Thana'],
    Dharampasha: ['Dharampasha Thana'],
    Shantiganj: ['Shantiganj Thana'],
  },

  // Rangpur Division
  Rangpur: {
    RangpurSadar: ['Kotwali Thana', 'Tajhat Thana', 'Mahiganj Thana', 'Haragach Thana'],
    Badarganj: ['Badarganj Thana'],
    Pirganj: ['Pirganj Thana'],
    Mithapukur: ['Mithapukur Thana'],
    Gangachara: ['Gangachara Thana'],
    Kaunia: ['Kaunia Thana'],
    Pirgachha: ['Pirgachha Thana'],
    Taraganj: ['Taraganj Thana'],
  },
  Dinajpur: {
    DinajpurSadar: ['Kotwali Thana'],
    Birganj: ['Birganj Thana'],
    Biral: ['Biral Thana'],
    Parbatipur: ['Parbatipur Thana'],
    Phulbari: ['Phulbari Thana'],
    NawabganjDinajpur: ['Nawabganj Thana'],
    Ghoraghat: ['Ghoraghat Thana'],
    Hakimpur: ['Hili Landport Thana'],
    Bochaganj: ['Bochaganj Thana'],
  },
  Kurigram: {
    KurigramSadar: ['Kurigram Sadar Thana'],
    Nageshwari: ['Nageshwari Thana'],
    Bhurungamari: ['Bhurungamari Thana'],
    Ulipur: ['Ulipur Thana'],
    Chilmari: ['Chilmari Thana'],
    Rajarhat: ['Rajarhat Thana'],
    Rowmari: ['Rowmari Thana'],
  },
  Gaibandha: {
    GaibandhaSadar: ['Gaibandha Sadar Thana'],
    Gobindaganj: ['Gobindaganj Thana'],
    Sundarganj: ['Sundarganj Thana'],
    Sadullapur: ['Sadullapur Thana'],
    Palashbari: ['Palashbari Thana'],
    Saghata: ['Saghata Thana'],
  },
  Lalmonirhat: {
    LalmonirhatSadar: ['Lalmonirhat Sadar Thana'],
    Patgram: ['Patgram Thana'],
    Hatibandha: ['Hatibandha Thana'],
    KaliganjLalmonirhat: ['Kaliganj Thana'],
    Aditmari: ['Aditmari Thana'],
  },
  Nilphamari: {
    NilphamariSadar: ['Nilphamari Sadar Thana'],
    Saidpur: ['Saidpur Thana'],
    Jaldhaka: ['Jaldhaka Thana'],
    KishoreganjNilphamari: ['Kishoreganj Thana'],
    Domar: ['Domar Thana'],
    Dimla: ['Dimla Thana'],
  },
  Panchagarh: {
    PanchagarhSadar: ['Panchagarh Sadar Thana'],
    Tetulia: ['Tetulia Thana'],
    Boda: ['Boda Thana'],
    Debiganj: ['Debiganj Thana'],
    Atwari: ['Atwari Thana'],
  },
  Thakurgaon: {
    ThakurgaonSadar: ['Thakurgaon Sadar Thana'],
    PirganjThakurgaon: ['Pirganj Thana'],
    Ranisankail: ['Ranisankail Thana'],
    Baliadangi: ['Baliadangi Thana'],
    Haripur: ['Haripur Thana'],
  },

  // Mymensingh Division
  Mymensingh: {
    MymensinghSadar: ['Kotwali Model Thana'],
    Muktagachha: ['Muktagachha Thana'],
    Trishal: ['Trishal Thana'],
    Bhaluka: ['Bhaluka Thana'],
    Gafargaon: ['Gafargaon Thana'],
    Fulbaria: ['Fulbaria Thana'],
    Ishwarganj: ['Ishwarganj Thana'],
    Haluaghat: ['Haluaghat Thana'],
    Gouripur: ['Gouripur Thana'],
  },
  Jamalpur: {
    JamalpurSadar: ['Jamalpur Sadar Thana'],
    Sarishabari: ['Sarishabari Thana'],
    Melandaha: ['Melandaha Thana'],
    Dewanganj: ['Dewanganj Thana'],
    Madarganj: ['Madarganj Thana'],
    Islampur: ['Islampur Thana'],
    Bakshiganj: ['Bakshiganj Thana'],
  },
  Netrokona: {
    NetrokonaSadar: ['Netrokona Model Thana'],
    Kendua: ['Kendua Thana'],
    Mohanganj: ['Mohanganj Thana'],
    Durgapur: ['Durgapur Thana'],
    Purbadhala: ['Purbadhala Thana'],
    Kalmakanda: ['Kalmakanda Thana'],
    Barhatta: ['Barhatta Thana'],
  },
  Sherpur: {
    SherpurSadar: ['Sherpur Sadar Thana'],
    Nalitabari: ['Nalitabari Thana'],
    Nakla: ['Nakla Thana'],
    Sreebardi: ['Sreebardi Thana'],
    Jhenaigati: ['Jhenaigati Thana'],
  },
};

export function getDistricts(): string[] {
  return Object.keys(BANGLADESH_LOCATIONS).sort();
}

export function isInsideDhaka(district: string): boolean {
  if (!district) return true;
  return district.trim().toLowerCase() === 'dhaka';
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
