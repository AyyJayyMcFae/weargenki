// =============================================================
// products.js — Single source of truth for all catalog data
// =============================================================

const PRODUCTS = [
  {
    id: 'sigilism-boxy-tank',
    title: 'Sigilism Boxy Tank',
    price: '$35.00 ',
    badge: 'NEW',
    categories: ['Tops'],
    keywords: 'sigilism boxy tank sleeveless shirt graphic tank top',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    surcharges: {},
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772839813/Sigilism_Boxy_Tank_Black_Front_f4tb2e.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772839817/Sigilism_Boxy_Tank_Black_Back_fsf5om.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772839820/Sigilism_Boxy_Tank_Black_Collar_plh6gu.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: [] },
      {
        name: 'Grey', color: 'bg-gray-500',
        images: [
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772839830/Sigilism_Boxy_Tank_Grey_Front_dn1glq.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772839828/Sigilism_Boxy_Tank_Grey_Back_qimu7g.png',
        ],
      },
    ],
    details: [
      'Relaxed boxy fit with dropped armholes.',
      'Soft, breathable cotton fabric.',
      'Striking sigil graphic on the front.',
    ],
  },

  {
    id: 'rainman-jersey',
    title: 'Rainman Button-Up Jersey',
    price: '$60.00 ',
    badge: 'NEW',
    categories: ['Tops'],
    keywords: 'rainman buttonup button up jersey baseball jersey athletic shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 3 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772837873/Rainman_Jersey_Red_Front_nqs8rl.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772837877/Rainman_Jersey_Red_Back_bw0srx.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772837890/Rainman_Jersey_Red_Buttons_gope0m.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772838162/Rainman_Jersey_Red_Hem_ghwenb.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772837904/Rainman_Jersey_Red_Bunch_ynareq.png',
    ],
    colors: [
      { name: 'Red', color: 'bg-red-800', images: [] },
      {
        name: 'Black', color: 'bg-black',
        images: [
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772838168/Rainman_Jersey_Black_Front_h9yu1c.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772838167/Rainman_Jersey_Black_back_zfqyzu.png',
        ],
      },
      {
        name: 'Rain Blue', color: 'bg-blue-200',
        images: [
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772838326/Rainman_Jersey_blue_Front_hwvf4h.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772838326/Rainman_Jersey_blue_Back_j5qiou.png',
        ],
      },
    ],
    details: [
      'Breathable mesh fabric for all-day comfort.',
      'Bold "RAINMAN" lettering on the back.',
      'Ribbed collar and armholes for a classic look.',
    ],
  },

  {
    id: 'vintage-washed-distressed-jeans',
    title: 'Vintage Washed Distressed Jeans',
    price: '$60.00 ',
    badge: 'NEW',
    categories: ['Bottoms', 'Denim'],
    keywords: 'vintage washed distressed jeans denim pants',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 5 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772834385/VW_Distressed_Jeans_dcuyf6.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772834388/VW_Distressed_Jeans_B_iskfyl.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772834396/Vintage_Wash_Distressed_Denim_Jeans-gallery-3_sztoeh.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772834903/Vintage_Wash_Distressed_Denim_Jeans-gallery-4_o8n3an.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772834915/Vintage_Wash_Distressed_Denim_Jeans-gallery-7_j5rqx4.png',
    ],
    colors: [],
    details: [
      'Classic straight-leg jeans with a vintage wash.',
      'Distressed detailing for a worn-in look.',
      'Durable denim with a comfortable fit.',
    ],
  },

  {
    id: 'genki-kinetic-performance-shortskirt',
    title: 'Genki Kinetic™ Performance ShortSkirt',
    price: '$45.00 ',
    badge: 'FIT',
    categories: 'Bottoms',
    keywords: 'genki kinetic™™ performance shortskirt athletic skirt tennis skirt',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 3 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599084/Genki_Sport_Performance_Skirt_White_vtfxel.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599083/Genki_Sport_Performance_Skirt_White_B_hdm1ht.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599087/Genki_Sport_Performance_Skirt_Stripes_mcxk3c.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599085/GS_Performance_Skirt_Shorts_ziaxd1.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599095/GS_Performance_Skirt_Waist_llaqhx.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599099/image_2026-03-03_223911069_z0eoay.png',
    ],
    colors: [
      { name: 'White', color: 'bg-white', images: [] },
      {
        name: 'Black', color: 'bg-black',
        images: [
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599086/Genki_Sport_Performance_Skirt_fwmg8o.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599084/Genki_Sport_Performance_Skirt_B_evqgdc.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772599902/GS_Performance_Skirt_Pose_ucqss2.png',
        ],
      },
    ],
    details: [
      'Athletic short skirt with built-in performance shorts.',
      'Moisture-wicking fabric for all-day comfort.',
      'Flared silhouette with elastic waistband.',
    ],
  },

  {
    id: 'ouroboros-sun-fade-fur-hoodie',
    title: 'Ouroboros Sun Fade Fur Hoodie',
    price: '$100.00 ',
    badge: 'NEW',
    categories: ['Tops', 'outerwear'],
    keywords: 'ouroboros sun fade fur hoodie sweatshirt pullover',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 5 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772582737/Ouroboro_Sun_Fade_Fur_Hoodie_B_vselav.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772582743/Ouroboro_Sun_Fade_Fur_Hoodie_F_oarton.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772582749/Ouroboro_Sun_Fade_Fur_Hoodie_Hood_g3tzz5.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772582746/Ouroboro_Sun_Fade_Fur_Hoodie_Sleeve_oxmkm3.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772582751/Ouroboro_Sun_Fade_Fur_Hoodie_Bunch_qijrur.png',
    ],
    colors: [],
    details: [
      'Cozy faux fur hoodie with GENKI Ouroboros design.',
      'Soft and warm with a relaxed fit.',
      'Features a front kangaroo pocket and adjustable drawstring hood.',
    ],
  },

  {
    id: 'esquire-rough-edge-drawstring-shorts',
    title: 'Esquire Rough Edge Drawstring Shorts',
    price: '$50.00 ',
    badge: 'NEW',
    categories: 'Bottoms',
    keywords: 'esquire rough edge drawstring shorts casual pants',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 3 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772583816/Esquire_REDS_F_igglsb.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772583522/Esquire_REDS_B_qg0lri.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772584158/Esquire_REDS_Waist_v2mfn9.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772584363/Esquire_REDS_Pocket_gtru5m.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: [] },
      {
        name: 'Grey', color: 'bg-white',
        images: [
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772583526/Esquire_REDS_Grey_F_vm7otq.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772583523/Esquire_REDS_Grey_B_skzat7.png',
        ],
      },
    ],
    details: [
      'Casual drawstring shorts with rough edge hem.',
      'Lightweight cotton blend for all-day comfort.',
      'Relaxed fit with functional side pockets.',
    ],
  },

  {
    id: 'vintage-washed-heavyweight-jeans',
    title: 'Vintage Washed Heavyweight Jeans',
    price: '$85.00 ',
    badge: 'NEW',
    categories: 'Bottoms',
    keywords: 'vintage washed heavyweight jeans denim pants trousers',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 3 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772581613/VW_Jeans_F_bia8iq.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772581771/VW_Jeans_B_vuw1fj.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772581343/VW_Jeans_Waist_fbhwr9.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772581621/VW_Jeans_Bunch_ifihdj.png',
    ],
    colors: [],
    details: [
      'Classic straight leg fit with vintage wash.',
      'Durable cotton denim with soft handfeel.',
      'Cropped ankle length with raw hem.',
    ],
  },

  {
    id: 'ouroboros-striped-straight-legs',
    title: 'Ouroboros Striped Straight Legs',
    price: '$55.00 ',
    badge: 'NEW',
    categories: 'Bottoms',
    keywords: 'ouroboros striped straight legs pants trousers',
    sizes: ['S', 'M', 'L', 'XL'],
    surcharges: { '2XL†': 3 },
    images: [
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772667327/ourobours_pants_F_tz2us2.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772667326/ourobours_pants_B_h1eqrs.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772595273/ourobours_SSL_Stripe_f2xqfy.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772595272/ourobours_SSL_Hem_vv3owh.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772595271/ourobours_SSL_Waist_oau5in.png',
      'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772595274/ourobours_SSL_Bunch_qo7mni.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: [] },
      {
        name: 'Green', color: 'bg-brand-army',
        images: [
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772595435/Ouroboros_SSL_F_yl6c5w.png',
          'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772595435/Ouroboros_SSL_B_bfvugy.png',
        ],
      },
    ],
    details: [
      'Relaxed straight leg fit with GENKI striping.',
      'Midweight cotton blend with soft handfeel.',
      'Cropped ankle length with elastic cuffs.',
    ],
  },

  {
    id: 'genki-kinetic-long-sleeve-shirt',
    title: 'Genki Kinetic™ Long Sleeve Shirt',
    price: '$55.00 ',
    badge: 'FIT',
    categories: 'Tops',
    keywords: 'genki kinetic™ champion long sleeve shirt athletic',
    sizes: ['S', 'M', 'L', 'XL', '2XL†'],
    surcharges: { '2XL†': 2 },
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490502110580-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490502110580-5.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490502110580-4.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490502110580-6.png',
    ],
    colors: [],
    details: [
      'Athletic long sleeve fit for daily wear.',
      'Clean GENKI Sport styling with lightweight comfort.',
      'Easy layering piece for cooler weather.',
    ],
  },

  {
    id: 'rosebush-drawstring-bag',
    title: 'Rosebush Drawstring Bag',
    price: '$35.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'rosebush drawstring bag floral accessory',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17009474928894-0.png',
    ],
    colors: [],
    details: [
      'Lightweight drawstring bag with rosebush graphic.',
      'Great for gym, errands, and daily carry.',
      'Compact profile with practical capacity.',
    ],
  },

  {
    id: 'genki-cards-kiss-cut-stickers',
    title: 'Miki Cards Kiss-Cut Stickers',
    price: '$5.00 ',
    badge: '',
    urgencyTag: 'Archiving',
    categories: 'Accessories',
    keywords: 'genki cards kiss-cut stickers decal',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173412876110165-0.png',
    ],
    colors: [],
    details: [
      'Kiss-cut sticker set with GENKI card-inspired art.',
      'Weather-resistant finish for laptops and bottles.',
      'Clean peel application.',
    ],
  },

  {
    id: 'genki-topographic-spiral-notebook',
    title: 'Genki Topographic Spiral Notebook',
    price: '$20.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'genki topographic spiral notebook stationery',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-172925600012141-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-172925600012141-1.png',
    ],
    colors: [],
    details: [
      'Spiral notebook with topographic GENKI cover graphic.',
      'Portable format for notes and sketches.',
      'Designed as everyday desk carry.',
    ],
  },

  {
    id: 'genki-nomad-beanie',
    title: 'Nomad Beanie',
    price: '$30.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'genki nomad beanie knit cap',
    primaryOptionLabel: 'Beanie',
    secondaryOptionLabel: 'Kanji',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170099458117494-0.png',
    ],
    skullOptions: [
      {
        name: 'Dark Kanji', color: 'bg-neutral-700',
        hoodies: [
          { name: 'Pink', color: 'bg-pink-300', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170099458117494-0.png'] },
          { name: 'Gold', color: 'bg-yellow-600', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170099458112882-0.png'] },
          { name: 'Grey', color: 'bg-gray-400', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17009945818937-0.png'] },
          { name: 'White', color: 'bg-white', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17009945818938-0.png'] },
        ],
      },
      {
        name: 'Light Kanji', color: 'bg-neutral-100',
        hoodies: [
          { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17009944148936-0.png'] },
          { name: 'Brown', color: 'bg-amber-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170099441412880-0.png'] },
          { name: 'Dark Grey', color: 'bg-neutral-800', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170099441412881-0.png'] },
          { name: 'Navy', color: 'bg-brand-navy', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17009944148940-0.png'] },
        ],
      },
    ],
    details: [
      'Nomad beanie with kanji embroidery options.',
      'Choose beanie color and kanji style.',
      'Knit construction for everyday wear.',
    ],
  },

  {
    id: 'genki-inkblot-beanie',
    title: 'Inkblot Beanie',
    price: '$30.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'genki inkblot beanie knit cap',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17007739318938-0.png',
    ],
    colors: [
      { name: 'White', color: 'bg-white', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17007739318938-0.png'] },
      { name: 'Pink', color: 'bg-pink-200', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170077393117494-0.png'] },
      { name: 'Gold', color: 'bg-yellow-600', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170077393112882-0.png'] },
      { name: 'Grey', color: 'bg-gray-400', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17007739318937-0.png'] },
      { name: 'Red', color: 'bg-red-600', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17007739318939-0.png'] },
    ],
    details: [
      'Inkblot series knit beanie.',
      'Soft profile for daily wear.',
      'Simple cuffed fit.',
    ],
  },

  {
    id: 'genki-woman-eco-tote',
    title: 'Miki Eco Tote',
    price: '$35.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'tote eco sustainable woman miki bag environmentally friendly eco-friendly environment',
    sizes: ['One Size'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-172881681510457-0.png',
    ],
    colors: [],
    details: [
      'Eco-friendly tote bag made from recycled materials.',
      'Perfect for carrying your essentials in style.',
      'Features a unique GENKI logo design.',
    ],
  },

  {
    id: 'rosebush-heavy-hoodie',
    title: 'Rosebush Heavy Hoodie',
    price: '$65.00 ',
    badge: '',
    categories: 'Tops',
    keywords: 'hoodie heavy rosebush oversized casual',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-16754042575530-0.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: [] },
      { name: 'Maroon', color: 'bg-brand-maroon', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-16754042575586-0.png'] },
    ],
    details: [
      'Heavyweight hoodie with a rosebush print.',
      'Made from 85% cotton, 15% polyester blend.',
      'Oversized fit for comfort and style.',
    ],
  },

  {
    id: 'genki-nomad-jacket',
    title: 'GENKI Nomad Jacket',
    price: '$85.00 ',
    badge: '',
    categories: ['Tops', 'outerwear'],
    keywords: 'jacket Unfinished packable casual kanji',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094910711008-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094910711008-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712698-1.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094910711008-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094910711008-0.png'] },
      { name: 'Navy', color: 'bg-gray-800', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094910711014-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094910711014-0.png'] },
      { name: 'Gold', color: 'bg-yellow-600', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094893011026-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094893011026-0.png'] },
      { name: 'Light Blue', color: 'bg-blue-300', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094893012049-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094893012049-0.png'] },
      { name: 'Neon Green', color: 'bg-brand-neon', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094893013434-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094893013434-0.png'] },
    ],
    details: [
      'Lightweight and packable for on-the-go lifestyles.',
      'Water-resistant fabric to keep you dry.',
    ],
  },

  {
    id: 'acd-organic-sweatshirt',
    title: '[ACD] Unfinished Organic Sweatshirt',
    price: '$40.00 ',
    badge: '[ACD] Sketch',
    categories: 'Tops',
    keywords: "sweatshirt Unfinished organic casual sketch artwork ali can't draw",
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712698-5.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712698-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712698-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712698-4.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: [] },
      { name: 'Grey', color: 'bg-gray-500', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712713-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712713-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712713-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712713-4.png'] },
      { name: 'Blue', color: 'bg-blue-600', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712728-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712728-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712728-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712728-0.png'] },
      { name: 'Green', color: 'bg-green-700', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712703-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712703-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712703-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712703-4.png'] },
      { name: 'Brown', color: 'bg-brand-charcoal', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712708-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712708-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712708-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509461712708-4.png'] },
    ],
    details: [
      'Organic cotton material for sustainability.',
      'Unfinished fit, suitable for all.',
      "Features the \"Ali Can't Draw\" Sketch #014 graphic.",
      'Ribbed cuffs and hem.',
    ],
  },

  {
    id: 'genki-kinetic-fitted-tee',
    title: 'Genki Kinetic™ Fitted T-shirt',
    price: '$40.00 ',
    surcharges: { '2XL†': 2.00, '3XL†': 3.00 },
    badge: 'FIT',
    categories: 'Tops',
    keywords: 'fitted t-shirt fit breathable lightweight comfortable genki',
    sizes: ['S', 'M', 'L', 'XL', '2XL†', '3XL†'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674886-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674886-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674886-1.png',
    ],
    colors: [
      { name: 'Navy', color: 'bg-brand-navy', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674886-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674886-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674886-1.png'] },
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674865-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674865-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349048674865-1.png'] },
      { name: 'Pink', color: 'bg-red-300', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490486713571-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490486713571-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173490486713571-1.png'] },
    ],
    details: [
      'Lightweight and breathable fabric for active wear.',
      'Fitted cut for a sleek look.',
      'Features the GENKI Sport logo on the chest.',
    ],
  },

  {
    id: 'genki-kinetic-fleece-joggers',
    title: 'Genki Kinetic™ Fleece Joggers',
    price: '$55.00 ',
    surcharges: { '2XL†': 3.00 },
    badge: 'FIT',
    categories: 'Bottoms',
    keywords: 'fleece joggers fit comfortable warm genki activewear',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL†'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613839-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613839-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613839-3.png',
    ],
    colors: [
      { name: 'Maroon', color: 'bg-brand-maroon' },
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526611265-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526611265-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526611265-3.png'] },
      { name: 'Rose', color: 'bg-brand-dusty', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613833-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613833-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613833-3.png'] },
      { name: 'Fatigue Green', color: 'bg-brand-fatigue', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613845-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613845-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613845-3.png'] },
      { name: 'Navy', color: 'bg-brand-navy', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613851-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613851-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602526613851-3.png'] },
    ],
    details: [
      'Soft fleece material for warmth and comfort.',
      'Elastic waistband with drawstring for adjustable fit.',
      'Features the GENKI logo on the thigh.',
    ],
  },

  {
    id: 'acd-4am-vibes-tee',
    title: '[ACD] 4 AM Vibes Heavy Tee',
    price: '$45.00 ',
    badge: '[ACD] Sketch',
    urgencyTag: 'Upgrading',
    categories: 'Tops',
    keywords: "heavy tee 4 am vibes acd sketch comfortable durable artwork ali can't draw",
    sizes: ['S', 'M', 'L', 'XL', '2XL†'],
    surcharges: { '2XL†': 2.00 },
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17653149238850-4.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17653149238850-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17653149238850-3.png',
    ],
    colors: [],
    details: [
      'Heavyweight fabric for durability.',
      'Relaxed fit for comfort.',
      'Features the "4 AM Vibes" [ACD] Sketch graphic.',
    ],
  },

  {
    id: 'acd-neko-pastel-cap',
    title: '[ACD] Neko Pastel Baseball Cap',
    price: '$30.00 ',
    badge: '[ACD] Sketch',
    categories: 'Accessories',
    keywords: "cap pastel neko baseball adjustable lightweight japanese cat hat artwork ali can't draw",
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212418-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212418-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212418-3.png',
    ],
    colors: [
      { name: 'Pastel Pink', color: 'bg-pink-50' },
      { name: 'Pastel Lemon', color: 'bg-yellow-50', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212416-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212416-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212416-3.png'] },
      { name: 'Pastel Mint', color: 'bg-green-50', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212417-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212417-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212417-3.png'] },
      { name: 'Pastel Blue', color: 'bg-blue-50', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212415-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212415-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176509539212415-3.png'] },
    ],
    details: [
      'Adjustable fit ensures comfort.',
      'Soft pastel color tones for a lighter aesthetic.',
      'Features the Japanese Neko (Cat) graphic.',
    ],
  },

  {
    id: 'genki-america-snapback',
    title: 'Make America Genki Again Electric Blue Snapback',
    price: '$30.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'snapback electric blue genki cap maga political parody hat',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17617999204796-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17617999204796-3.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17617999204796-6.png',
    ],
    colors: [{ name: 'Electric Blue', color: 'bg-blue-400' }],
    details: [
      'Vibrant electric blue brim and accents.',
      'Classic snapback style with adjustable closure.',
      'Features bold Genki statement branding.',
    ],
  },

  {
    id: 'genki-sakura-hoodie',
    title: 'Sakura Heavy Hoodie',
    price: '$75.00 ',
    surcharges: { '2XL†': 2.00, '3XL†': 3.00, '4XL†': 5.00, '5XL†': 6.00 },
    badge: '',
    categories: 'Tops',
    keywords: 'hoodie heavy sakura genki thick warm comfortable japanese flower',
    sizes: ['S', 'M', 'L', 'XL', '2XL†', '3XL†', '4XL†', '5XL†'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17658626415530-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17658626415530-1.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17658626415530-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17658626415530-1.png'] },
      { name: 'Pink', color: 'bg-pink-200', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586264110849-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586264110849-1.png'] },
      { name: 'Maroon', color: 'bg-red-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17658626415586-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17658626415586-1.png'] },
      { name: 'Forest Green', color: 'bg-emerald-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586264120570-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586264120570-1.png'] },
      { name: 'Blue', color: 'bg-blue-300', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586264121635-0.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586264121635-1.png'] },
    ],
    details: [
      'Thick, heavyweight material for maximum warmth.',
      'Unique minimalist embroidered Sakura logo.',
      'Comfortable and durable.',
    ],
  },

  {
    id: 'genki-skull-hoodie',
    title: 'Skull Hoodie',
    price: '$65.00 ',
    surcharges: { '2XL†': 2.00, '3XL†': 3.00, '4XL†': 5.00, '5XL†': 6.00 },
    badge: '',
    urgencyTag: 'Upgrading',
    categories: 'Tops',
    keywords: 'hoodie heavy skull genki thick warm comfortable japanese flower',
    sizes: ['S', 'M', 'L', 'XL', '2XL†', '3XL†', '4XL†', '5XL†'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173449331512997-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173449331512997-2.png',
    ],
    skullOptions: [
      {
        name: 'Black Skull', color: 'bg-black',
        hoodies: [
          { name: 'Sand', color: 'bg-yellow-100', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173449331512997-0.png'] },
          { name: 'Ash', color: 'bg-neutral-100', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173449331520544-0.png'] },
          { name: 'White', color: 'bg-white', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17344933155522-0.png'] },
          { name: 'Pink', color: 'bg-pink-200', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173449331510849-0.png'] },
          { name: 'Light Blue', color: 'bg-blue-200', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173449331510841-0.png'] },
        ],
      },
      {
        name: 'Red Skull', color: 'bg-red-800',
        hoodies: [
          { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349980575530-0.png'] },
          { name: 'Maroon', color: 'bg-red-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349980575586-0.png'] },
          { name: 'Sand', color: 'bg-yellow-100', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173499805712997-0.png'] },
          { name: 'Grey', color: 'bg-gray-200', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349980575610-0.png'] },
          { name: 'Ash', color: 'bg-neutral-100', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173499805720544-0.png'] },
        ],
      },
      {
        name: 'White Skull', color: 'bg-white',
        hoodies: [
          { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349986875530-0.png'] },
          { name: 'Maroon', color: 'bg-red-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349986875586-0.png'] },
          { name: 'Chocolate', color: 'bg-yellow-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349986875554-0.png'] },
          { name: 'Navy', color: 'bg-brand-navy', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17349986875594-0.png'] },
        ],
      },
    ],
    details: [
      'Thick, heavyweight material for maximum warmth.',
      'Unique minimalist embroidered Sakura logo.',
      'Comfortable and durable.',
    ],
  },

  {
    id: 'genki-esquire-jacket',
    title: 'Esquire Packable Jacket',
    price: '$85.00 ',
    surcharges: { '2XL†': 6.00 },
    badge: '',
    categories: ['Tops', 'Outerwear'],
    keywords: 'jacket packable esquire genki lightweight warm comfortable',
    sizes: ['S', 'M', 'L', 'XL', '2XL†'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211008-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211008-0.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211008-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211008-0.png'] },
      { name: 'Gold', color: 'bg-yellow-600', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211026-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211026-0.png'] },
      { name: 'Royal Blue', color: 'bg-blue-800', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211744-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305211744-0.png'] },
      { name: 'Safety Green', color: 'bg-lime-300', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305213435-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176681305213435-0.png'] },
    ],
    details: [
      'Thick, heavyweight material for maximum warmth.',
      'Unique minimalist embroidered Sakura logo.',
      'Comfortable and durable.',
    ],
  },

  {
    id: 'acd-kancho-hancho-shirt',
    title: '[ACD] Kancho Hancho Button Up Shirt',
    price: '$70.00 ',
    surcharges: { '2XL†': 2.00, '3XL†': 3.00, '4XL†': 5.00, '5XL†': 6.00, '6XL†': 7.00 },
    badge: '[ACD] Sketch',
    urgencyTag: 'Archiving',
    categories: 'Tops',
    keywords: "button-up shirt kancho hancho acd sketch casual lightweight artwork ali can't draw",
    sizes: ['S', 'M', 'L', 'XL', '2XL†', '3XL†', '4XL†', '5XL†', '6XL†'],
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586211717117-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586211717117-0.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586211717117-12.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-176586211717117-13.png',
    ],
    details: [
      'Lightweight and breathable fabric for comfort.',
      'Features the "Kancho Hancho" [ACD] Sketch graphic.',
      'Classic button-up design with a relaxed fit.',
    ],
  },

  {
    id: 'genki-rainman-reverse-tee',
    title: 'Rainman Reverse Graphic Tee',
    price: '$40.00 ',
    badge: '',
    categories: 'Tops',
    keywords: 't-shirt rainman graphic genki reverse',
    sizes: ['S', 'M', 'L', 'XL', '2XL†', '3XL†', '4XL†'],
    surcharges: { '2XL†': 2.00, '3XL†': 3.00, '4XL†': 5.00 },
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-5.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-3.png',
    ],
    colors: [
      { name: 'Fatigue Green', color: 'bg-brand-fatigue', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-174708690117202-3.png'] },
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019575-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019575-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019575-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019575-3.png'] },
      { name: 'Watermelon', color: 'bg-red-400', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019395-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019395-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019395-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019395-3.png'] },
      { name: 'Navy', color: 'bg-blue-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019546-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019546-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019546-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869019546-3.png'] },
      { name: 'Blue', color: 'bg-blue-300', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869018481-5.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869018481-2.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869018481-1.png', 'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17470869018481-3.png'] },
    ],
    details: [
      'Bold graphic print design.',
      'Reverse-style construction for a deconstructed look.',
    ],
  },

  {
    id: 'genki-sakura-duffel-bag',
    title: 'Sakura Duffel Bag',
    price: '$115.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'duffel bag sakura genki floral',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094616612021-1.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094616612021-3.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094616612021-2.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170094616612021-5.png',
    ],
    colors: [],
    details: [
      'Spacious duffel bag with a floral sakura design.',
      'Durable material for everyday use.',
      'Front zip pocket and adjustable shoulder strap.',
    ],
  },

  {
    id: 'genki-two-faced-hoodie',
    title: 'Two Faced Hoodie',
    price: '$85.00 ',
    badge: '',
    categories: 'Tops',
    keywords: 'hoodie two-faced genki unique design',
    sizes: ['S', 'M', 'L', 'XL', '2XL†', '3XL†', '4XL†', '5XL†', '6XL†'],
    surcharges: { '2XL†': 2.00, '3XL†': 3.00, '4XL†': 5.00, '5XL†': 6.00, '6XL†': 7.00 },
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602693618730-12.png',
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-173602693618730-13.png',
    ],
    colors: [],
    details: [
      'Unique two-faced design for high contrast styling.',
      'Mid-weight cotton blend.',
      'Oversized fit.',
    ],
  },

  {
    id: 'genki-shinobi-beanie',
    title: 'Genki Village Shinobi Beanie',
    price: '$30.00 ',
    badge: '',
    categories: 'Accessories',
    keywords: 'beanie shinobi ninja naruto genki warm comfortable knit hat',
    images: [
      'https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-170122662217496-0.png',
    ],
    colors: [
      { name: 'Black', color: 'bg-black', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17012266228936-0.png'] },
      { name: 'Red', color: 'bg-red-700', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17012266228939-0.png'] },
      { name: 'Blue', color: 'bg-blue-800' },
      { name: 'White', color: 'bg-white', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17012266228938-0.png'] },
      { name: 'Navy', color: 'bg-blue-950', images: ['https://uploads.twitchalerts.com/000/115/629/159/21699478-mockup-17012266228940-0.png'] },
    ],
    details: [
      'Soft knit material for warmth.',
      'Features the embroidered Shinobi logo.',
    ],
  },
];

// Normalise urgencyTag values on load
const URGENCY_TAG_VALUES = new Set(['Archiving', 'Vaulting', 'Upgrading', '']);
function normalizeUrgencyTag(value) {
  const raw = value == null ? '' : String(value).trim();
  if (!raw) return '';
  const canonical = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return URGENCY_TAG_VALUES.has(canonical) ? canonical : '';
}
PRODUCTS.forEach((product) => {
  product.urgencyTag = normalizeUrgencyTag(product.urgencyTag);
});
