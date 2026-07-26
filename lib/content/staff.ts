export interface StaffMember {
  slug: string;
  /** Filename in public/staff/ (e.g. "VictorOladejo.jpg"). Omit to use {slug}.jpg */
  photo?: string;
  name: string;
  role: string;
  joined: string;
  bio: string[];
}

export const STAFF_MEMBERS: StaffMember[] = [
  {
    slug: 'rebecca-femi-adebile',
    name: 'Rebecca Femi-Adebile',
    role: 'Board of Trustees',
    joined: 'July 2021',
    bio: [
      'Rebecca Femi-Adebile joined the ministry in July 2021 following her marriage to the ministry\'s founder, Evangelist Femi Adebile.',
      'She serves as a core member of the Board of Trustees, providing strategic leadership and governance in advancing the ministry\'s vision and mission.',
      'Rebecca is committed to seeing lives transformed through the Gospel and remains a strong pillar of support in the ministry\'s mission of raising disciples and producing Christ-centered media that impact the nations.',
    ],
  },
  {
    slug: 'asegun-oluyemi',
    photo: 'AssignOluyemi.jpg',
    name: 'Asegun Oluyemi',
    role: 'Editing · PCA Programme Coordinator',
    joined: 'June 2009',
    bio: [
      'A foundation member of the ministry since June 2009 when the ministry was based in Ogbomoso.',
      'He holds a B.Sc in Statistics from LAUTECH and an M.Sc in Mathematics Education from the University of Ilorin.',
      'He serves in the Editing Department and coordinates the Professional Diploma Programme at PREM Creative Academy. A gifted writer, educator, film producer, actor, life coach, and dynamic public speaker.',
    ],
  },
  {
    slug: 'oladejo-victor',
    photo: 'VictorOladejo.jpg',
    name: 'Oladejo Victor',
    role: 'PCA Ghana Campus Coordinator',
    joined: '2015',
    bio: [
      'Graduate of the Federal University of Technology, Akure (FUTA) with a degree in Statistics.',
      'National Coordinator of PREM Creative Academy, Ghana Campus.',
      'Creative storyteller — story writer, cinematographer, producer, and book author committed to compelling Gospel narratives.',
    ],
  },
  {
    slug: 'oladejo-joshua',
    photo: 'OladejoJoshua.jpg',
    name: 'Oladejo Joshua',
    role: 'Personal Assistant to the President',
    joined: '2016',
    bio: [
      'Graduate of FUTA with a degree in Biochemistry.',
      'Personal Assistant to the President, supporting leadership in administration and coordination.',
      'Talented film director, producer, actor, and comical content creator using visual storytelling and wholesome humor.',
    ],
  },
  {
    slug: 'ayomiotan-arowosafe',
    photo: 'AyomitanArowosafe.jpg',
    name: 'Ayomiotan Arowosafe',
    role: 'Financial Secretary',
    joined: '2019',
    bio: [
      'Studying Civil Engineering at Olusegun Agagu University of Science and Technology, Okitipupa.',
      'Financial Secretary of the ministry, overseeing financial records with diligence and integrity.',
      'Life coach passionate about mentoring people to discover purpose and live impactful lives.',
    ],
  },
  {
    slug: 'gabriel-adeosun',
    photo: 'GabrielOluwafemiAdeosun.jpg',
    name: 'Gabriel Adeosun',
    role: 'Content Creation',
    joined: '2019',
    bio: [
      'Studying Microbiology at FUTA.',
      'Creates promotional and PR videos for the ministry\'s film productions, showcasing PREM\'s vision to wider audiences.',
    ],
  },
  {
    slug: 'olayinka-olamide',
    photo: 'OlayinkaAbayomi.jpg',
    name: 'Olayinka Olamide',
    role: 'Post-Production · Continuity',
    joined: '2019',
    bio: [
      'Studying Biology Education at Adeyemi Federal University of Education, Ondo.',
      'Integral post-production team member — continuity management and subtitle editing.',
      'Talented film actor and producer contributing on-screen and behind the scenes.',
    ],
  },
  {
    slug: 'afolayan-boluwatife',
    photo: 'BoluwatifeAfolayan.jpg',
    name: 'Afolayan Boluwatife',
    role: 'Gaffer · IGOMOC Construction',
    joined: '2020',
    bio: [
      'Studied Cooperative Economics and Management at Federal Polytechnic, Ile-Oluji.',
      'Gaffer of the production team, overseeing lighting operations.',
      'Heads ongoing construction at The International Gospel Movie City (IGOMOC).',
    ],
  },
  {
    slug: 'francis-fasikun',
    photo: 'GasolineFransis.jpg',
    name: 'Francis Fasikun',
    role: 'Chief Editor & Cinematographer',
    joined: 'April 2021',
    bio: [
      'Chief Editor and Chief Cinematographer, leading post-production and cinematography departments.',
      'Technical expertise and commitment to excellence have greatly enhanced the quality of PREM\'s audiovisual productions.',
    ],
  },
  {
    slug: 'agbokli-rockford',
    photo: 'AgbokliRockford.jpg',
    name: 'Agbokli Rockford',
    role: 'Sound Engineer',
    joined: '2022',
    bio: [
      'Studying Economics Education at Adeyemi Federal University of Education, Ondo.',
      'Sound Engineer ensuring high-quality audio during filming and post-production.',
    ],
  },
  {
    slug: 'jeremiah-oriloye',
    photo: 'OriloyeJeremiah.jpg',
    name: 'Jeremiah Oriloye',
    role: 'Production Manager',
    joined: 'December 2024',
    bio: [
      'Graduate of Federal University of Agriculture, Abeokuta — Biochemistry.',
      'Production Manager and Logistics Coordinator, overseeing personnel, equipment, and logistics for every production.',
    ],
  },
  {
    slug: 'abiodun-ayeloja',
    photo: 'AyelojaAbiodun.jpg',
    name: 'Abiodun Ayeloja',
    role: 'Writer · Producer · Director',
    joined: 'December 2024',
    bio: [
      'Studied Guidance and Counselling at Adekunle Ajasin University, Akungba.',
      'Writer, producer, and director passionate about compelling stories that communicate biblical truths.',
    ],
  },
  {
    slug: 'barnabas-ogana',
    photo: 'BarnabasOganaJacobs.jpg',
    name: 'Barnabas Ogana',
    role: 'Production Assistant · Cinematography',
    joined: 'December 2025',
    bio: [
      'Production Assistant and emerging cinematographer supporting film productions.',
      'Co-heads construction work at The International Gospel Movie City (IGOMOC).',
    ],
  },
];
