/* ==========================================================================
   RoamBite — Food Truck Booking & Directory Dataset
   ========================================================================== */

window.ROAMBITE_DATA = {
  trucks: [
    {
      id: "sol-birria",
      name: "Sol & Smoke Birria",
      cuisine: "Mexican",
      city: "Austin, TX",
      neighborhood: "South Congress",
      rating: 4.9,
      reviews: 342,
      priceRange: "$$",
      availability: "Open Now",
      bookingReady: true,
      hours: "11:00 AM – 10:00 PM",
      cateringMin: "$450 min event",
      image: "assets/images/truck-tacos.jpg",
      description: "Slow-braised beef quesabirria tacos crisped on the flat top, served with rich consomme, charred salsa verde, and handmade corn tortillas.",
      dishes: ["3x Crispy Quesabirria Tacos", "Birria Ramen Cup", "Street Corn Elote", "Agua Fresca Jamaica"],
      amenities: ["Private Catering", "Vegan Option", "Gluten-Free Corn", "Late Night"]
    },
    {
      id: "velvet-smash",
      name: "Velvet Smash Co.",
      cuisine: "Burgers",
      city: "Austin, TX",
      neighborhood: "East 6th Street",
      rating: 4.8,
      reviews: 289,
      priceRange: "$$",
      availability: "Open Now",
      bookingReady: true,
      hours: "11:30 AM – 11:00 PM",
      cateringMin: "$500 min event",
      image: "assets/images/truck-burger.jpg",
      description: "Lacy-edged Wagyu double smash burgers on toasted potato brioche with aged Tillamook cheddar, house purple-onion jam, and rosemary crinkle fries.",
      dishes: ["Double Velvet Smash", "Truffle Bacon Melt", "Rosemary Crinkle Fries", "Salted Caramel Shake"],
      amenities: ["Corporate Lunches", "Wedding Late-Night", "Halal Beef", "Fast Service"]
    },
    {
      id: "forno-roll",
      name: "Forno on Wheels",
      cuisine: "Pizza",
      city: "Denver, CO",
      neighborhood: "RiNo Art District",
      rating: 4.9,
      reviews: 218,
      priceRange: "$$",
      availability: "Booking Available",
      bookingReady: true,
      hours: "12:00 PM – 9:30 PM",
      cateringMin: "$650 min event",
      image: "assets/images/truck-pizza.jpg",
      description: "900°F oak-fired mobile brick oven baking 72-hour fermented Neapolitan pies with San Marzano DOP tomatoes and fior di latte.",
      dishes: ["Margherita Classica", "Hot Honey Diavola", "Wild Mushroom Bianca", "Garlic Knot Bites"],
      amenities: ["Live Brick Oven", "Vegetarian Friendly", "Party Packages", "Custom Menu"]
    },
    {
      id: "ember-pit",
      name: "Ember & Oak Smokehouse",
      cuisine: "BBQ",
      city: "Nashville, TN",
      neighborhood: "The Gulch",
      rating: 4.7,
      reviews: 410,
      priceRange: "$$$",
      availability: "Open Now",
      bookingReady: true,
      hours: "11:00 AM – 8:30 PM",
      cateringMin: "$800 min event",
      image: "assets/images/truck-bbq.jpg",
      description: "14-hour post-oak smoked prime brisket, heritage St. Louis ribs, jalapeno cheddar cornbread, and tangy espresso-molasses BBQ glaze.",
      dishes: ["Prime Brisket Plate", "Glazed Half-Rack Ribs", "Pulled Pork Brioche", "Jalapeno Cornbread"],
      amenities: ["Large Festivals", "Full Buffet Setup", "Gluten-Free Meats", "Draft Tea"]
    },
    {
      id: "cloud-bao",
      name: "Cloud Nine Bao",
      cuisine: "Chinese",
      city: "Portland, OR",
      neighborhood: "Hawthorne Blvd",
      rating: 4.8,
      reviews: 265,
      priceRange: "$",
      availability: "Open Now",
      bookingReady: true,
      hours: "11:30 AM – 9:00 PM",
      cateringMin: "$400 min event",
      image: "assets/images/truck-bao.jpg",
      description: "Pillow-soft hand-folded Taiwanese gua bao stuffed with 5-spice crispy pork belly, pickled mustard greens, crushed peanuts, and chili crisp.",
      dishes: ["Pork Belly Gua Bao", "Crispy Tofu Bao (V)", "Sichuan Chili Dumplings", "Yuzu Sparkling Fizz"],
      amenities: ["Vegan Friendly", "Quick Grab & Go", "Festival Favorite", "Nut-Free Option"]
    },
    {
      id: "dulce-roam",
      name: "Dulce & Espresso",
      cuisine: "Desserts",
      city: "San Diego, CA",
      neighborhood: "North Park",
      rating: 4.9,
      reviews: 315,
      priceRange: "$",
      availability: "Weekend Events",
      bookingReady: true,
      hours: "7:30 AM – 6:00 PM",
      cateringMin: "$350 min event",
      image: "assets/images/truck-churros.jpg",
      description: "To-order cinnamon-sugar churros paired with 70% dark chocolate ganache, iced horchata espresso lattes, and Madagascar vanilla cold foam.",
      dishes: ["Churro Flight & Ganache", "Iced Horchata Latte", "Ceremonial Matcha Cream", "Dulce de Leche Affogato"],
      amenities: ["Morning Events", "Wedding Dessert Bar", "Oat Milk Included", "Zero-Waste Cups"]
    },
    {
      id: "harbor-roll",
      name: "Harbor Butter Roll",
      cuisine: "Street Food",
      city: "Boston, MA",
      neighborhood: "Seaport District",
      rating: 4.8,
      reviews: 194,
      priceRange: "$$$",
      availability: "Booking Available",
      bookingReady: true,
      hours: "11:00 AM – 7:30 PM",
      cateringMin: "$750 min event",
      image: "assets/images/truck-lobster.jpg",
      description: "Warm Connecticut-style butter-poached Maine lobster rolls on griddled split-top brioche with charred lemon, chives, and sea-salt kettle chips.",
      dishes: ["Warm Butter Lobster Roll", "Crispy Cod Po'Boy", "New England Clam Chowder", "Tarragon Kettle Chips"],
      amenities: ["VIP Corporate", "Coastal Events", "Fresh Daily Catch", "Outdoor Seating"]
    },
    {
      id: "olive-grove",
      name: "Saffron & Chaat Express",
      cuisine: "Indian",
      city: "Chicago, IL",
      neighborhood: "West Loop",
      rating: 4.9,
      reviews: 230,
      priceRange: "$$",
      availability: "Open Now",
      bookingReady: true,
      hours: "11:00 AM – 9:00 PM",
      cateringMin: "$450 min event",
      image: "assets/images/truck-falafel.jpg",
      description: "Crispy Punjabi samosa chaat, spiced chickpea bowls, warm garlic naan wraps, mint chutney, and chilled Alphonso mango lassi.",
      dishes: ["Samosa Chaat Bowl", "Tandoori Paneer Naan Wrap", "Crispy Pakora Platter", "Mango Lassi"],
      amenities: ["100% Vegan Options", "Gluten-Free Bowls", "Corporate Catering", "Eco Packaging"]
    },
    {
      id: "nashville-crisp",
      name: "Hot Honey & Waffle Co.",
      cuisine: "Street Food",
      city: "Nashville, TN",
      neighborhood: "East Nashville",
      rating: 4.8,
      reviews: 276,
      priceRange: "$$",
      availability: "Weekend Events",
      bookingReady: true,
      hours: "10:00 AM – 9:30 PM",
      cateringMin: "$550 min event",
      image: "assets/images/truck-waffles.jpg",
      description: "Crispy buttermilk-brined Nashville hot chicken stacked on golden Belgian waffles with spicy wildflower honey glaze and house pickles.",
      dishes: ["Hot Chicken & Waffles", "Mild Honey Tender Box", "Pimento Mac & Cheese", "Peach Sweet Tea"],
      amenities: ["Brunch Events", "Festival Favorite", "Spice Levels Mild–Fire", "Party Trays"]
    },
    {
      id: "boba-bloom",
      name: "Boba & Bloom Drinks",
      cuisine: "Desserts",
      city: "Seattle, WA",
      neighborhood: "Capitol Hill",
      rating: 4.9,
      reviews: 312,
      priceRange: "$",
      availability: "Open Now",
      bookingReady: true,
      hours: "11:00 AM – 10:00 PM",
      cateringMin: "$350 min event",
      image: "assets/images/truck-boba.jpg",
      description: "Small-batch brown sugar boba milk tea, ceremonial strawberry matcha lattes, and sparkling mango passionfruit coolers crafted to order.",
      dishes: ["Brown Sugar Boba Tea", "Strawberry Matcha Latte", "Mango Passionfruit Fizz", "Ube Cream Puff"],
      amenities: ["Dairy-Free Milks", "Wedding Beverage Bar", "Campus Pop-Ups", "Zero-Plastic Straws"]
    },
    {
      id: "roma-street",
      name: "Roma Wood & Panini",
      cuisine: "Italian",
      city: "Denver, CO",
      neighborhood: "LoDo Plaza",
      rating: 4.8,
      reviews: 184,
      priceRange: "$$",
      availability: "Booking Available",
      bookingReady: true,
      hours: "11:30 AM – 9:00 PM",
      cateringMin: "$550 min event",
      image: "assets/images/hero-truck.jpg",
      description: "Crispy Roman-style pinsa flatbreads, prosciutto & burrata focaccia panini, and truffle arancini served fresh from a custom mobile kitchen.",
      dishes: ["Burrata Focaccia Panini", "Truffle Mushroom Arancini", "Pinsa Diavola", "Tiramisu Cup"],
      amenities: ["Corporate Lunches", "Wedding Cocktail Hour", "Vegetarian Options", "Fast Service"]
    }
  ],

  cuisines: [
    {
      name: "Mexican",
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple-deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16a10 10 0 0 1 20 0H2z"/><path d="M7 12c1-2 3-2 4 0"/><path d="M13 12c1-2 3-2 4 0"/></svg>`,
      count: "48 Trucks"
    },
    {
      name: "Burgers",
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple-deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16a2 2 0 0 0-2-6H6a2 2 0 0 0-2 6z"/><path d="M3 14h18"/><path d="M4 17h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1z"/></svg>`,
      count: "36 Trucks"
    },
    {
      name: "Pizza",
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple-deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 20h20L12 2z"/><circle cx="12" cy="12" r="1.5"/><circle cx="9.5" cy="16.5" r="1.5"/><circle cx="14.5" cy="16.5" r="1.5"/></svg>`,
      count: "24 Trucks"
    },
    {
      name: "BBQ",
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple-deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1 4-2 6-2 10a4 4 0 0 0 8 0c0-3-2-5-2-8-1 2-3 2-4-2z"/><path d="M5 19h14"/></svg>`,
      count: "29 Trucks"
    },
    {
      name: "Chinese",
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple-deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 20h8"/><path d="M9 7V4"/><path d="M15 7V4"/></svg>`,
      count: "31 Trucks"
    },
    {
      name: "Desserts",
      icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--purple-deep)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
      count: "22 Trucks"
    }
  ],

  events: [
    {
      id: "evt-1",
      day: "22",
      month: "NOV",
      title: "Twilight Taco & Beats Rally",
      location: "Republic Square Plaza, Austin, TX",
      time: "5:00 PM – 10:30 PM",
      trucksCount: "18 Food Trucks",
      image: "assets/images/hero-festival.jpg",
      description: "Live indie DJs, 18 curated street food trucks, craft agua fresca bars, and family picnic seating under Edison lights."
    },
    {
      id: "evt-2",
      day: "29",
      month: "NOV",
      title: "RiNo Wood-Fired & Brews Weekend",
      location: "RiNo Art District, Denver, CO",
      time: "12:00 PM – 8:00 PM",
      trucksCount: "14 Food Trucks",
      image: "assets/images/truck-pizza.jpg",
      description: "Artisan pizza ovens, smoked brisket pop-ups, and local craft beverage trucks celebrating autumn street cuisine."
    },
    {
      id: "evt-3",
      day: "06",
      month: "DEC",
      title: "Winter Churro & Espresso Market",
      location: "North Park Promenade, San Diego, CA",
      time: "9:00 AM – 4:00 PM",
      trucksCount: "12 Food Trucks",
      image: "assets/images/truck-churros.jpg",
      description: "Specialty coffee roasters, warm cinnamon churros, savory brunch baos, and handmade holiday artisan stalls."
    }
  ],

  testimonials: [
    {
      name: "Maya Lin",
      role: "Event Director, PulseTech",
      initials: "ML",
      rating: 5,
      quote: "We booked three trucks through RoamBite for our 400-person company summer social. Transparent pricing, zero back-and-forth emails, and the birria tacos stole the show."
    },
    {
      name: "Carlos & Elena Vega",
      role: "Wedding Couple, Austin",
      initials: "CV",
      rating: 5,
      quote: "Having Velvet Smash Co. and Dulce & Espresso roll up at 10 PM for our wedding reception was the highlight of the night. Every guest is still talking about it."
    },
    {
      name: "Devon Brooks",
      role: "Festival Organizer, Denver",
      initials: "DB",
      rating: 5,
      quote: "RoamBite cut our vendor coordination time in half. Checking real-time availability, health permits, and menus in one directory is a game changer."
    },
    {
      name: "Priya Nair",
      role: "Founder, Cloud Nine Bao",
      initials: "PN",
      rating: 5,
      quote: "Since listing our truck on RoamBite, our private corporate bookings tripled in four months. The vendor portal makes calendar management effortless."
    }
  ],

  articles: [
    {
      id: "art-1",
      title: "How to Book the Perfect Food Truck Lineup for Your Wedding or Corporate Event",
      category: "Guides",
      author: "Camila Reyes",
      date: "Nov 12, 2026",
      readTime: "6 min read",
      image: "assets/images/hero-festival.jpg",
      excerpt: "From calculating guest-per-hour service speed to balancing savory mains with dessert trucks, here is our complete playbook for stress-free mobile catering.",
      content: [
        "Booking a food truck for a private celebration brings unmatched energy, fresh made-to-order flavor, and a built-in visual centerpiece. Yet many event planners underestimate how differently mobile kitchens operate compared to traditional banquet caterers.",
        "First, calculate throughput: a well-staffed gourmet taco or burger truck comfortably serves 60 to 80 guests per hour on a curated 3-to-4 item menu. For events over 150 guests, pairing two complementary trucks—such as Sol & Smoke Birria alongside Cloud Nine Bao—eliminates queues and gives attendees variety.",
        "Second, confirm power, parking clearance, and level ground 48 hours ahead. Most trucks require a 25-foot flat footprint and appreciate clear load-in instructions. With RoamBite's instant booking brief, every truck confirms these logistics before you pay your deposit."
      ]
    },
    {
      id: "art-2",
      title: "Inside Sol & Smoke: How One Austin Taco Truck Scaled to 200+ Private Bookings a Year",
      category: "Vendor Stories",
      author: "Marcus Vance",
      date: "Nov 08, 2026",
      readTime: "5 min read",
      image: "assets/images/truck-tacos.jpg",
      excerpt: "Chef Mateo Morales shares how streamlining his catering menu and joining RoamBite turned weekend street corners into a thriving year-round business.",
      content: [
        "Three years ago, Mateo Morales launched Sol & Smoke Birria with a refurbished step van and a single 10-gallon stockpot. Word-of-mouth kept weekend lines long, but weekday revenue was unpredictable.",
        "By creating dedicated 50-guest and 100-guest catering packages on RoamBite, Mateo unlocked tech-campus lunches and wedding late-night snacks. Today, private bookings account for 65% of his annual revenue with predictable prep and zero food waste."
      ]
    },
    {
      id: "art-3",
      title: "2026 Street Food Trends: Why Quesabirria, Gua Bao & Craft Horchata Dominate",
      category: "Trends",
      author: "Hannah Cho",
      date: "Nov 02, 2026",
      readTime: "4 min read",
      image: "assets/images/truck-bao.jpg",
      excerpt: "Handheld comfort food with bold texture contrasts and craft non-alcoholic pairings are leading bookings across every major U.S. city this season.",
      content: [
        "Across 18,000+ RoamBite orders this year, diners are gravitating toward dishes that deliver crunch, richness, and bright acidity in a single handheld bite.",
        "Steamed Taiwanese gua bao with crispy pork belly, oak-fired Neapolitan slices, and iced horchata espresso flights are the fastest-growing search terms in our directory."
      ]
    },
    {
      id: "art-4",
      title: "Winter Night Markets: Top 5 Food Truck Rallies Happening This Month",
      category: "Events",
      author: "Jordan Ellis",
      date: "Oct 28, 2026",
      readTime: "4 min read",
      image: "assets/images/truck-bbq.jpg",
      excerpt: "Bundle up and bring your appetite—discover the best outdoor twilight food truck plazas, live music stages, and heated patio setups near you.",
      content: [
        "Cooler evenings only make wood-fired pizza ovens and smoky brisket pits more inviting. From Austin's Republic Square to Denver's RiNo Art District, local organizers are adding fire pits and acoustic stages to keep street food season rolling.",
        "Check our Events feed weekly or filter the Directory by 'Weekend Events' to see where your favorite trucks are parked tonight."
      ]
    },
    {
      id: "art-5",
      title: "The Food Truck Owner's Checklist: Pricing Catering Packages for Profit",
      category: "Guides",
      author: "Priya Nair",
      date: "Oct 19, 2026",
      readTime: "7 min read",
      image: "assets/images/truck-burger.jpg",
      excerpt: "Stop undercharging for travel time and prep labor. Learn the exact formula top-rated RoamBite vendors use to price private events.",
      content: [
        "Many new mobile kitchen owners quote private events using their street-corner menu prices—forgetting commissary prep hours, generator fuel, insurance riders, and minimum service guarantees.",
        "A healthy catering quote separates per-guest food cost from a flat truck mobilization fee, ensuring even smaller 40-person gatherings remain profitable."
      ]
    },
    {
      id: "art-6",
      title: "Coffee & Churros on Four Wheels: Designing a Morning-to-Midnight Dessert Truck",
      category: "Vendor Stories",
      author: "Elena Gomez",
      date: "Oct 11, 2026",
      readTime: "5 min read",
      image: "assets/images/truck-churros.jpg",
      excerpt: "How Dulce & Espresso serves office espresso bars at 8 AM and warm chocolate-dipped churros at wedding receptions by 10 PM.",
      content: [
        "Most food trucks peak at lunch or dinner, leaving morning hours untapped. Dulce & Espresso built a dual-purpose workflow: espresso and matcha service for corporate mornings, transitioning to freshly piped cinnamon churros for evening celebrations."
      ]
    }
  ],

  faqsContact: [
    {
      q: "How far in advance should I book a food truck for a private event?",
      a: "For weekend weddings and festivals, we recommend booking 4 to 8 weeks ahead. For weekday corporate lunches or neighborhood pop-ups, many RoamBite trucks accept requests as little as 5 days in advance."
    },
    {
      q: "Is there a minimum guest count or spend to book a truck?",
      a: "Each truck sets its own event minimum—typically between $350 and $800 depending on cuisine and travel distance. You can view each truck's exact minimum inside their 'View Details' modal."
    },
    {
      q: "What happens if the weather is bad on my event date?",
      a: "All bookings include a flexible weather-reschedule policy. If severe weather hits, you can move your event date within 90 days or coordinate covered tent service with your vendor."
    },
    {
      q: "Do RoamBite trucks carry health permits and liability insurance?",
      a: "Yes. Every vendor listed on RoamBite undergoes verification for active municipal health permits, commissary kitchen compliance, and commercial liability coverage."
    }
  ],

  faqsVendor: [
    {
      q: "How long does it take to get my food truck approved on RoamBite?",
      a: "Once you submit your registration via the Vendor Portal, our onboarding team verifies your permits and menu within 24 to 48 hours so you can start receiving booking inquiries right away."
    },
    {
      q: "Do I pay a commission on street-corner walk-up sales?",
      a: "Never. RoamBite charges zero commission on your daily walk-up customers. Our directory drives foot traffic to your live location for free."
    },
    {
      q: "Can I block off dates when my truck is already booked?",
      a: "Yes! Your vendor dashboard includes an instant availability calendar so you only receive event requests for dates and neighborhoods you want to work."
    },
    {
      q: "Can I upgrade or cancel my vendor membership anytime?",
      a: "Absolutely. All paid plans are month-to-month or annual with zero lock-in contracts—you can switch tiers or pause anytime."
    }
  ]
};
