/* ==========================================================================
   RoamBite — Shared Application State, Role Auth & LocalStorage Persistence
   ========================================================================== */

(function () {
  const KEYS = {
    SESSION: "roambite_session",
    USERS: "roambite_users",
    TRUCKS: "roambite_trucks",
    CUISINES: "roambite_cuisines",
    BOOKINGS: "roambite_bookings",
    TRANSACTIONS: "roambite_transactions",
    PROMOS: "roambite_promos",
    REVIEWS: "roambite_reviews",
    BLOG: "roambite_blog",
    ENQUIRIES: "roambite_enquiries",
    SETTINGS: "roambite_settings",
    MENUS: "roambite_vendor_menus",
    SCHEDULES: "roambite_vendor_schedules",
    FAVORITES: "roambite_customer_favorites",
    LOCATIONS: "roambite_saved_locations",
    NOTIFICATIONS: "roambite_notifications"
  };

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedIfEmpty() {
    const base = window.ROAMBITE_DATA || { trucks: [], cuisines: [], articles: [] };

    if (!localStorage.getItem(KEYS.USERS)) {
      set(KEYS.USERS, [
        { id: "u-admin", name: "Camila Reyes", email: "admin@roambite.com", password: "Admin@123", role: "admin", city: "Austin, TX", status: "Active", joined: "2025-01-10" },
        { id: "u-vendor-1", name: "Mateo Morales", email: "chef@solsmoke.com", password: "Vendor@123", role: "vendor", truckId: "sol-birria", city: "Austin, TX", status: "Active", joined: "2025-03-14" },
        { id: "u-vendor-2", name: "Priya Nair", email: "priya@cloudbao.com", password: "Vendor@123", role: "vendor", truckId: "cloud-bao", city: "Portland, OR", status: "Active", joined: "2025-04-22" },
        { id: "u-cust-1", name: "Alex Rivera", email: "alex@foodie.com", password: "User@123", role: "customer", city: "Austin, TX", status: "Active", joined: "2025-06-05" },
        { id: "u-cust-2", name: "Maya Lin", email: "maya@pulsetech.io", password: "User@123", role: "customer", city: "Denver, CO", status: "Active", joined: "2025-08-19" }
      ]);
    }

    if (!localStorage.getItem(KEYS.TRUCKS)) {
      const seededTrucks = (base.trucks || []).map((t, i) => ({
        ...t,
        approvalStatus: i === base.trucks.length - 1 ? "Pending" : "Approved",
        ownerEmail: i === 0 ? "chef@solsmoke.com" : "vendors@roambite.com"
      }));
      set(KEYS.TRUCKS, seededTrucks);
    }

    if (!localStorage.getItem(KEYS.CUISINES)) {
      set(KEYS.CUISINES, [
        { id: "c-1", name: "Mexican", count: 48, active: true },
        { id: "c-2", name: "Indian", count: 19, active: true },
        { id: "c-3", name: "Italian", count: 22, active: true },
        { id: "c-4", name: "Chinese", count: 31, active: true },
        { id: "c-5", name: "Burgers", count: 36, active: true },
        { id: "c-6", name: "Pizza", count: 24, active: true },
        { id: "c-7", name: "BBQ", count: 29, active: true },
        { id: "c-8", name: "Desserts", count: 22, active: true },
        { id: "c-9", name: "Street Food", count: 44, active: true }
      ]);
    }

    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      set(KEYS.BOOKINGS, [
        { id: "BK-1042", truckId: "sol-birria", truckName: "Sol & Smoke Birria", customerEmail: "alex@foodie.com", customerName: "Alex Rivera", eventType: "Corporate Lunch", date: "2026-11-24", guests: 85, location: "Congress Ave Tech Hub, Austin", amount: 1275, status: "Confirmed" },
        { id: "BK-1043", truckId: "sol-birria", truckName: "Sol & Smoke Birria", customerEmail: "maya@pulsetech.io", customerName: "Maya Lin", eventType: "Wedding Late-Night", date: "2026-11-28", guests: 140, location: "Barton Creek Lawn, Austin", amount: 2100, status: "Pending" },
        { id: "BK-1044", truckId: "velvet-smash", truckName: "Velvet Smash Co.", customerEmail: "alex@foodie.com", customerName: "Alex Rivera", eventType: "Birthday Party", date: "2026-11-10", guests: 50, location: "Zilker Park Pavilion", amount: 750, status: "Completed" },
        { id: "BK-1045", truckId: "forno-roll", truckName: "Forno on Wheels", customerEmail: "maya@pulsetech.io", customerName: "Maya Lin", eventType: "Team Social", date: "2026-12-03", guests: 110, location: "RiNo Art District, Denver", amount: 1650, status: "In Progress" }
      ]);
    }

    if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
      set(KEYS.TRANSACTIONS, [
        { id: "TX-9901", bookingId: "BK-1042", truckName: "Sol & Smoke Birria", customer: "Alex Rivera", total: 1275, fee: 127.5, net: 1147.5, date: "2026-11-15", status: "Paid" },
        { id: "TX-9902", bookingId: "BK-1044", truckName: "Velvet Smash Co.", customer: "Alex Rivera", total: 750, fee: 75, net: 675, date: "2026-11-08", status: "Settled" },
        { id: "TX-9903", bookingId: "BK-1045", truckName: "Forno on Wheels", customer: "Maya Lin", total: 1650, fee: 165, net: 1485, date: "2026-11-16", status: "Paid" }
      ]);
    }

    if (!localStorage.getItem(KEYS.PROMOS)) {
      set(KEYS.PROMOS, [
        { id: "pr-1", code: "ROAM50", discount: "$50 Off", minOrder: "$450", expiry: "2026-12-31", active: true },
        { id: "pr-2", code: "RALLY15", discount: "15% Off", minOrder: "$900", expiry: "2026-12-15", active: true }
      ]);
    }

    if (!localStorage.getItem(KEYS.REVIEWS)) {
      set(KEYS.REVIEWS, [
        { id: "rev-1", truckId: "sol-birria", truckName: "Sol & Smoke Birria", author: "Alex Rivera", rating: 5, comment: "The crispy quesabirria and hot consomme were a huge hit at our team lunch!", date: "2026-11-11", status: "Published", reply: "Thank you Alex! Loved serving your crew." },
        { id: "rev-2", truckId: "velvet-smash", truckName: "Velvet Smash Co.", author: "Maya Lin", rating: 5, comment: "Fastest smash burger line ever. 100 guests fed in under 45 minutes.", date: "2026-11-05", status: "Published", reply: "" }
      ]);
    }

    if (!localStorage.getItem(KEYS.BLOG)) {
      set(KEYS.BLOG, base.articles || []);
    }

    if (!localStorage.getItem(KEYS.ENQUIRIES)) {
      set(KEYS.ENQUIRIES, [
        { id: "enq-1", name: "Jordan Taylor", email: "jordan@austinfest.org", topic: "Multi-Truck Festival Concierge", city: "Austin, TX", message: "Looking to book 6 food trucks for our December winter market.", date: "2026-11-16", status: "Open" },
        { id: "enq-2", name: "Sonia Patel", email: "sonia@chaatwheels.com", topic: "Vendor Onboarding & Account", city: "Chicago, IL", message: "Uploaded our health permit, checking approval timeline.", date: "2026-11-15", status: "Resolved" }
      ]);
    }

    if (!localStorage.getItem(KEYS.SETTINGS)) {
      set(KEYS.SETTINGS, {
        platformName: "RoamBite",
        supportEmail: "hello@roambite.com",
        commissionRate: 10,
        depositPercent: 25,
        instantBooking: true
      });
    }

    if (!localStorage.getItem(KEYS.MENUS)) {
      set(KEYS.MENUS, {
        "sol-birria": [
          { id: "m-1", name: "3x Crispy Quesabirria Tacos", category: "Mains", price: 14.5, desc: "Slow-braised beef, melted Oaxaca cheese, cilantro, onions & consomme.", image: "assets/images/truck-tacos.jpg", available: true },
          { id: "m-2", name: "Birria Ramen Cup", category: "Specials", price: 13.0, desc: "Rich chile-braised broth, ramen noodles, braised beef, and soft egg.", image: "assets/images/truck-bao.jpg", available: true },
          { id: "m-3", name: "Cinnamon Churro Pairing", category: "Desserts", price: 7.5, desc: "Warm cinnamon-sugar churros with dark chocolate dipping cup.", image: "assets/images/truck-churros.jpg", available: true }
        ]
      });
    }

    if (!localStorage.getItem(KEYS.SCHEDULES)) {
      set(KEYS.SCHEDULES, [
        { id: "sch-1", truckId: "sol-birria", date: "2026-11-20", location: "South Congress Food Park, Austin", time: "11:30 AM – 8:30 PM", type: "Street Service" },
        { id: "sch-2", truckId: "sol-birria", date: "2026-11-22", location: "Republic Square Rally, Austin", time: "5:00 PM – 10:30 PM", type: "Festival" },
        { id: "sch-3", truckId: "sol-birria", date: "2026-11-24", location: "Congress Ave Tech Hub, Austin", time: "12:00 PM – 2:30 PM", type: "Private Catering" }
      ]);
    }

    if (!localStorage.getItem(KEYS.FAVORITES)) {
      set(KEYS.FAVORITES, ["sol-birria", "velvet-smash", "forno-roll"]);
    }

    if (!localStorage.getItem(KEYS.LOCATIONS)) {
      set(KEYS.LOCATIONS, [
        { id: "loc-1", label: "Work Campus", address: "412 Congress Ave, Austin, TX" },
        { id: "loc-2", label: "Home Backyard", address: "1804 S Lamar Blvd, Austin, TX" }
      ]);
    }

    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      set(KEYS.NOTIFICATIONS, [
        { id: "n-1", role: "vendor", text: "New booking request BK-1043 from Maya Lin (140 guests).", time: "12m ago", unread: true },
        { id: "n-2", role: "vendor", text: "Payout of $1,147.50 scheduled for BK-1042.", time: "2h ago", unread: true },
        { id: "n-3", role: "customer", text: "Your booking BK-1042 with Sol & Smoke Birria is Confirmed!", time: "1h ago", unread: true },
        { id: "n-4", role: "admin", text: "Roma Wood & Panini submitted a new truck listing for approval.", time: "25m ago", unread: true }
      ]);
    }
  }

  seedIfEmpty();

  window.RoamBiteState = {
    KEYS,
    get,
    set,
    getSession() {
      return get(KEYS.SESSION, null);
    },
    login(email, password, expectedRole) {
      const users = get(KEYS.USERS, []);
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!user) return { ok: false, error: "Invalid email or password." };
      if (user.status === "Suspended") return { ok: false, error: "This account is suspended. Contact support." };
      if (expectedRole && user.role !== expectedRole) {
        return { ok: false, error: `This account is registered as ${user.role.toUpperCase()}. Please switch to the ${user.role} tab.` };
      }
      const session = { id: user.id, name: user.name, email: user.email, role: user.role, truckId: user.truckId || null, city: user.city || "Austin, TX" };
      set(KEYS.SESSION, session);
      return { ok: true, session };
    },
    register({ name, email, password, role, city, truckName, cuisine }) {
      const users = get(KEYS.USERS, []);
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }
      let truckId = null;
      if (role === "vendor") {
        truckId = "trk-" + Date.now();
        const trucks = get(KEYS.TRUCKS, []);
        trucks.unshift({
          id: truckId,
          name: truckName || `${name}'s Truck`,
          cuisine: cuisine || "Street Food",
          city: city || "Austin, TX",
          neighborhood: "Downtown",
          rating: 5.0,
          reviews: 1,
          priceRange: "$$",
          availability: "Booking Available",
          bookingReady: true,
          hours: "11:00 AM – 9:00 PM",
          cateringMin: "$450 min event",
          image: "assets/images/hero-truck.jpg",
          description: `Freshly registered ${cuisine || "street food"} mobile kitchen serving ${city || "Austin, TX"}.`,
          dishes: ["Chef Signature Combo", "Street Special"],
          amenities: ["Private Catering", "Verified New Vendor"],
          approvalStatus: "Pending",
          ownerEmail: email.trim().toLowerCase()
        });
        set(KEYS.TRUCKS, trucks);
      }
      const newUser = {
        id: "u-" + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        truckId,
        city: city || "Austin, TX",
        status: "Active",
        joined: new Date().toISOString().split("T")[0]
      };
      users.unshift(newUser);
      set(KEYS.USERS, users);
      const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, truckId, city: newUser.city };
      set(KEYS.SESSION, session);
      return { ok: true, session };
    },
    logout() {
      localStorage.removeItem(KEYS.SESSION);
    }
  };
})();

