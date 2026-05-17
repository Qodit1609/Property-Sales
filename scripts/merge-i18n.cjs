const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../src/locales");

const additionsEn = {
  common: {
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
    ok: "OK",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    loading: "Loading...",
    submit: "Submit",
    back: "Back",
    next: "Next",
    yes: "Yes",
    no: "No",
    all: "All",
    actions: "Actions",
    status: "Status",
    filters: "Filters",
    view: "View",
    approve: "Approve",
    reject: "Reject",
    optional: "Optional",
    required: "Required",
    na: "N/A",
    unknown: "Unknown",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
    notifications: "Notifications",
    logout: "Logout",
    welcome: "Welcome",
    closeMenu: "Close menu",
    openNavigation: "Open navigation",
    confirmLogout: "Confirm Logout",
    confirmLogoutMessage: "Are you sure you want to log out?",
  },
  auth: {
    brand: "BhoomiWala",
    fields: {
      email: "Email",
      password: "Password",
      name: "Name",
      mobile: "Mobile",
      confirmPassword: "Confirm Password",
      investmentInterest: "Investment Interest",
      propertyFocusType: "Property focus type",
      experienceYears: "Experience (years)",
    },
    placeholders: {
      email: "Enter your email",
      fullName: "Enter your full name",
      mobile: "10-digit mobile",
      investmentInterest: "e.g. Weekend home, farmland, resort",
      propertyFocus: "e.g. Farmhouse, agriculture land",
      experienceYears: "3",
    },
    actions: {
      hide: "Hide",
      show: "Show",
      hidePassword: "Hide password",
      showPassword: "Show password",
      hideConfirmPassword: "Hide confirm password",
      showConfirmPassword: "Show confirm password",
    },
    login: {
      title: "Sign in",
      subtitle: "Access your dashboard and saved activity.",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      submitting: "Signing in...",
      submit: "Sign in",
      newHere: "New here?",
      registerLink: "Register here",
    },
    register: {
      title: "Create your account",
      subtitle: "Choose your role and we'll take you to the right dashboard.",
      role: "Role",
      roles: { buyer: "BUYER", seller: "SELLER", agent: "AGENT" },
      hints: {
        seller: "Seller: tell us your property focus.",
        agent: "Agent: share your experience level.",
        buyer: "Buyer: choose your investment interest.",
      },
      submitting: "Creating account...",
      submit: "Register",
      signInCta: "Already have an account? Sign in",
      terms: "By registering, you agree to our terms.",
    },
    blocked: { title: "Alert", message: "You are blocked by Admin" },
    toast: {
      passwordMismatch: {
        title: "Passwords do not match",
        detail: "Please confirm your password again.",
      },
      success: {
        title: "Registration successful",
        detail: "Signing you in...",
      },
    },
  },
  footer: {
    sections: {
      quickLinks: "Quick Links",
      categories: "Categories",
      usefulLinks: "Useful Links",
      contact: "Contact Us",
    },
    newsletter: {
      title: "Stay Updated",
      description:
        "Get the latest property listings and investment tips delivered to your inbox.",
      emailLabel: "Email address",
      emailPlaceholder: "Enter your email",
      subscribeAria: "Subscribe to newsletter",
      subscribe: "Subscribe",
      thankYou: "Thank you for subscribing!",
    },
    backToTop: "Back to Top",
    backToTopAria: "Back to top",
    copyright: "© {{year}} BhoomiWala.com · All Rights Reserved",
    credits: "Developed with care by TRH",
  },
  homeSections: {
    farmingPromo: {
      eyebrow: "Farmland investment",
      title: "High-potential agricultural opportunities for long-term value",
      description:
        "Discover verified farmland listings with practical data around soil profile, irrigation access, and district-level growth demand.",
      badges: {
        verifiedDocs: "Verified documentation",
        farmingFilters: "Farming-specific filters",
        advisorSupport: "Advisor support",
      },
      ctaExplore: "Explore farmland",
      ctaPostLand: "Post your land",
      imageAlt: "Aerial view of cultivated farmland",
    },
    featuredFarms: {
      eyebrow: "Featured",
      title: "Featured properties BhoomiWala Assured Highly recommended",
      description: "Only active featured properties are shown here.",
    },
    districtExplorer: {
      eyebrow: "Location explorer",
      title: "Explore Top Agriculture Lands",
      description: "Discover opportunities and quickly jump into available inventory.",
      listingsCount: "{{count}}+ farming lands",
      viewListings: "View listings",
      ariaExploreDistrict: "Explore farmland listings in {{district}}",
      imageAlt: "Farmland in {{district}}",
    },
    benefits: {
      eyebrow: "Why choose us",
      title: "Built for modern farmland transactions",
      description:
        "A focused product experience designed to reduce friction in discovery, due diligence, and closure.",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "Trusted by farmland buyers and sellers",
      description:
        "Real customer stories from successful farmland discovery and closure journeys.",
      emptyMessageFallback: "This customer shared a positive experience with BhoomiWala.",
      defaultOccupation: "Farmland User",
      carouselAriaLabel: "Customer testimonials",
      prevAriaLabel: "Previous testimonial",
      nextAriaLabel: "Next testimonial",
      goToAriaLabel: "Go to testimonial {{index}}",
    },
    footerCta: {
      title: "Ready to find your next farmland investment?",
      description:
        "Explore verified listings, compare farming-specific metrics, and connect directly with land owners and advisors for confident closure.",
      ctaExplore: "Start exploring",
      ctaPostFree: "Post land for free",
    },
  },
  propertyList: { emptyFiltered: "No properties match your filters." },
  contactPopup: {
    badge: "PREMIUM ASSISTANCE",
    title: "Let us find your perfect property",
    subtitle:
      "Share your requirements and our expert team will connect with curated options.",
    closeAriaLabel: "Close contact form",
    fields: {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      message: "Message",
      messagePlaceholder: "Tell us your location preference, budget, and purpose...",
    },
    validation: {
      nameRequired: "Name is required.",
      emailRequired: "Email is required.",
      emailInvalid: "Enter a valid email address.",
      phoneRequired: "Phone number is required.",
      messageRequired: "Please enter your message.",
    },
    whatsapp: {
      message: "Hi, I'm interested in your property listing.{{nameSuffix}}",
      nameSuffix: " My name is {{name}}.",
    },
    footer: { responseTime: "We will get back to you within 24 hours." },
    actions: { whatsapp: "Quick WhatsApp", sending: "Sending...", submit: "Send Inquiry" },
    success:
      "Success! Your inquiry has been submitted. Our team will contact you shortly.",
    errors: { generic: "Something went wrong. Please try again in a moment." },
  },
  adminPanel: {
    fallbackName: "Admin",
    defaultSubtitle: "Track your workspace and tasks at a glance.",
    mobileMenuTitle: "Admin menu",
    a11y: {
      openNavigation: "Open admin navigation",
      closeMenu: "Close menu",
    },
    logoutConfirm: {
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
    },
    nav: {
      dashboard: "Dashboard",
      properties: "Properties",
      users: "Users",
      sellers: "Sellers",
      activityLogs: "Activity Logs",
      leadsManagement: "Leads Management",
      testimonial: "Testimonial",
      promotions: "Promotion Requests",
      images: "Images",
      notifications: "Notifications",
      account: "My Account",
    },
    dashboard: {
      title: "Admin Panel",
      overview: "Overview",
      subtitle: "Portfolio health across listings, users, and leads.",
    },
    properties: {
      title: "Properties",
      filtersAria: "Filters",
      searchPlaceholder: "Search on this page…",
      allStatuses: "All statuses",
      allTypes: "All types",
      status: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        sold: "Sold",
      },
      table: {
        property: "Property",
        type: "Type",
        price: "Price",
        status: "Status",
        actions: "Actions",
      },
      rejectModal: {
        title: "Reject listing",
        errorBothFields: "Please enter both a short description and a suggestion/message.",
        rejectWithoutReason: "Reject directly without giving any reason",
      },
      deleteModal: { title: "Delete property?" },
      actionBlocked: {
        title: "Action blocked",
        message: "First view the property",
      },
      toast: {
        approved: "Property approved",
        rejected: "Property rejected",
        deleted: "Property deleted",
      },
      viewed: "Viewed",
      unviewed: "Unviewed",
    },
    promotions: {
      title: "Promotion Requests",
      repromoteTitle: "RePromotion Request",
      repromoteDescription:
        "This will reset the promotion for 30 days starting from today. Do you want to continue?",
      heading: "Promotion Requests",
      toast: {
        approved: "Promotion approved",
        rejected: "Promotion rejected",
        extended: "Promotion extended for 30 days",
        deleted: "Promotion request deleted",
      },
      unknownSeller: "Seller: Unknown",
    },
    leads: {
      title: "Leads Management",
      subtitle: "Track inquiries, visits and agent-collected leads in one place.",
      allStatuses: "All statuses",
      searchPlaceholder: "Name, email, phone, property, agent…",
      failedLoad: "Failed to load leads",
      failedLoadDetails: "Failed to load lead details",
      stats: {
        total: "Total leads",
        buyerInquiries: "Buyer inquiries",
        visitRequests: "Visit requests",
        contactRequests: "Contact requests",
        callRequests: "Call requests",
        sellerLeads: "Seller leads",
        agentInquiries: "Agent inquiries",
      },
      table: {
        lead: "Lead",
        type: "Type",
        status: "Status",
        linked: "Linked",
        created: "Created",
        actions: "Actions",
      },
      detailTitle: "Lead details",
      fields: {
        email: "Email",
        phone: "Phone",
        created: "Created",
        lastUpdate: "Last update",
        propertySubject: "Property / subject",
        agent: "Agent",
        seller: "Seller",
        scheduledAt: "Scheduled at",
        visitType: "Visit type",
        notes: "Notes",
        submittedAt: "Submitted at",
        sentAt: "Sent at",
        failureReason: "Failure reason",
        viewCount: "View count",
        lastViewedAt: "Last viewed at",
        propertyType: "Property type",
        price: "Price",
        address: "Address",
        linkedProperty: "Linked property",
      },
    },
    testimonial: {
      actionBlocked: { title: "Action blocked", message: "First view the property" },
    },
    images: {
      deleteTitle: "Delete image?",
    },
    account: {
      title: "My Account",
      basicInfo: "Basic info",
      security: "Security",
      professional: "Professional",
      address: "Address",
      preferences: "Preferences",
      activity: "Activity",
      profileCompleted: "Profile Completed",
    },
    toast: {
      accessRestricted: "Access Restricted",
    },
  },
  buyerPanel: {
    shell: {
      menuTitle: "Buyer menu",
      openNavigation: "Open buyer navigation",
    },
    nav: {
      overview: "Overview",
      wishlist: "Wishlist",
      compare: "Compare",
      cart: "Cart",
      enquiries: "Enquiries",
      activity: "Activity",
      notifications: "Notifications",
      account: "Account",
      testimonial: "Testimonial",
    },
    topBar: {
      overview: {
        title: "Overview",
        subtitle: "Track saved properties and activity at a glance.",
      },
      wishlist: {
        title: "Wishlist",
        subtitle: "Properties you saved for later.",
      },
      compare: {
        title: "Compare",
        subtitle: "Side-by-side listing comparison.",
      },
      cart: {
        title: "Cart",
        subtitle: "Listings you plan to enquire about.",
      },
      account: {
        title: "Account",
        subtitle: "Your profile and preferences.",
      },
      activity: {
        title: "Activity",
        subtitle: "Recent views and interactions.",
      },
      enquiries: {
        title: "Enquiries",
        subtitle: "Status of your seller and agent conversations.",
      },
      testimonial: {
        title: "Testimonial",
        subtitle: "Share your experience with buyers and sellers.",
      },
      notifications: {
        title: "Notifications",
        subtitle: "Alerts and updates for your account.",
      },
      fallback: {
        title: "Buyer overview",
        subtitle: "Track saved properties and activity at a glance.",
      },
    },
    dashboard: {
      wishlist: "Wishlist",
      compare: "Compare",
      cart: "Cart",
      viewList: "View list →",
      curatedInventory: "Curated inventory",
      saveSearch: "Save search",
      savedSearches: "Saved searches",
      recentActivity: "Recent activity",
      matchingProperties: "Matching properties",
      recommendations: "Recommendations",
    },
    enquiries: {
      title: "Your enquiries",
      propertyEnquiry: "Property enquiry",
      visitScheduled: "Visit scheduled",
      callbackRequested: "Callback requested",
      replyRead: "Reply read",
      replyReceived: "Reply received",
    },
    testimonial: {
      title: "Share Your Testimonial",
      subtitle: "Tell us about your experience with BhoomiWala.",
    },
    account: {
      profileDetails: "Profile details",
      fields: {
        fullName: "Full name",
        email: "Email",
        mobile: "Mobile number",
        occupation: "Occupation",
        gender: "Gender",
        role: "Role",
      },
      placeholders: {
        mobile: "Enter mobile number",
        occupation: "Enter occupation",
        gender: "Select gender",
      },
      gender: { male: "Male", female: "Female", other: "Other" },
      roleBadge: "Buyer",
      preferences: {
        title: "Buyer preferences",
        subtitle: "Used to personalize recommendations and alerts.",
        locations: "Preferred locations",
        budgetFrom: "Budget from",
        budgetTo: "Budget to",
        propertyTypes: "Property types",
        save: "Save preferences",
      },
    },
  },
  agentPanel: {
    shell: {
      menuTitle: "Agent menu",
      openNavigation: "Open agent navigation",
      profileCompletion: "{{percent}}% complete",
    },
    nav: {
      dashboard: "Agent Dashboard",
      fieldEntry: "Field Entry",
      detailedEntry: "Detailed Entry",
      properties: "Properties",
      addProperty: "Add Property",
      leads: "Leads Management",
      visits: "Visit Scheduling",
      calendar: "Calendar",
      clients: "Clients",
      notifications: "Notifications",
      profile: "Agent Profile",
    },
    topBar: {
      dashboard: {
        title: "Overview",
        subtitle: "Portfolio health across listings and client activity.",
      },
      fieldEntry: {
        title: "Field Entry",
        subtitle: "Capture on-ground lead and listing updates.",
      },
      detailedEntry: {
        title: "Detailed Entry",
        subtitle: "Submit complete listing details for review.",
      },
      properties: {
        title: "Properties",
        subtitle: "Manage assigned and published properties.",
      },
      addProperty: {
        title: "Add Property",
        subtitle: "Create a new property draft with required details.",
      },
      leads: {
        title: "Leads",
        subtitle: "Track and convert active buyer leads.",
      },
      visits: {
        title: "Visits",
        subtitle: "Coordinate and monitor scheduled site visits.",
      },
      calendar: {
        title: "Calendar",
        subtitle: "Review scheduled visits date-wise.",
      },
      clients: {
        title: "Clients",
        subtitle: "Manage client information and follow-ups.",
      },
      profile: {
        title: "Agent Profile",
        subtitle: "Update your professional profile details.",
      },
      notifications: {
        title: "Notifications",
        subtitle: "Track latest alerts and updates.",
      },
    },
    calendar: {
      unknownDate: "Unknown date",
      failedLoad: "Failed to load calendar",
    },
  },
};

const additionsHi = JSON.parse(JSON.stringify(additionsEn));

function setHi(path, value) {
  const keys = path.split(".");
  let obj = additionsHi;
  for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
  obj[keys[keys.length - 1]] = value;
}

// Hindi translations (key UI strings)
setHi("common.close", "बंद करें");
setHi("common.confirm", "पुष्टि करें");
setHi("common.cancel", "रद्द करें");
setHi("common.ok", "ठीक है");
setHi("common.save", "सहेजें");
setHi("common.edit", "संपादित करें");
setHi("common.delete", "हटाएं");
setHi("common.search", "खोजें");
setHi("common.loading", "लोड हो रहा है...");
setHi("common.submit", "जमा करें");
setHi("common.all", "सभी");
setHi("common.actions", "कार्रवाई");
setHi("common.status", "स्थिति");
setHi("common.filters", "फ़िल्टर");
setHi("common.view", "देखें");
setHi("common.approve", "स्वीकृत करें");
setHi("common.reject", "अस्वीकार करें");
setHi("common.notifications", "सूचनाएं");
setHi("common.logout", "लॉगआउट");
setHi("common.welcome", "स्वागत है");
setHi("auth.login.title", "साइन इन");
setHi("auth.login.subtitle", "अपने डैशबोर्ड और सहेजी गई गतिविधि तक पहुँचें।");
setHi("auth.login.submit", "साइन इन");
setHi("auth.login.submitting", "साइन इन हो रहा है...");
setHi("auth.register.title", "अपना खाता बनाएं");
setHi("footer.sections.quickLinks", "त्वरित लिंक");
setHi("footer.sections.categories", "श्रेणियाँ");
setHi("footer.sections.usefulLinks", "उपयोगी लिंक");
setHi("footer.sections.contact", "संपर्क करें");
setHi("propertyList.emptyFiltered", "आपके फ़िल्टर से कोई प्रॉपर्टी मेल नहीं खाती।");
setHi("adminPanel.properties.title", "प्रॉपर्टीज");
setHi("adminPanel.nav.dashboard", "डैशबोर्ड");
setHi("buyerPanel.nav.overview", "अवलोकन");
setHi("agentPanel.nav.dashboard", "एजेंट डैशबोर्ड");

const hiFlat = {
  "auth.brand": "भूमिवाला",
  "auth.fields.email": "ईमेल",
  "auth.fields.password": "पासवर्ड",
  "auth.fields.name": "नाम",
  "auth.fields.mobile": "मोबाइल",
  "auth.fields.confirmPassword": "पासवर्ड की पुष्टि करें",
  "auth.placeholders.email": "अपना ईमेल दर्ज करें",
  "auth.login.rememberMe": "मुझे याद रखें",
  "auth.login.forgotPassword": "पासवर्ड भूल गए?",
  "auth.login.newHere": "नए हैं?",
  "auth.login.registerLink": "यहाँ रजिस्टर करें",
  "auth.blocked.message": "आपको एडमिन द्वारा ब्लॉक किया गया है",
  "footer.newsletter.title": "अपडेट रहें",
  "footer.newsletter.subscribe": "सब्सक्राइब करें",
  "footer.newsletter.thankYou": "सब्सक्राइब करने के लिए धन्यवाद!",
  "footer.backToTop": "ऊपर जाएं",
  "homeSections.farmingPromo.eyebrow": "कृषि भूमि निवेश",
  "homeSections.farmingPromo.ctaExplore": "कृषि भूमि देखें",
  "homeSections.featuredFarms.eyebrow": "फीचर्ड",
  "homeSections.districtExplorer.viewListings": "लिस्टिंग देखें",
  "homeSections.footerCta.ctaExplore": "खोज शुरू करें",
  "contactPopup.title": "आपकी सही प्रॉपर्टी खोजने में हमारी मदद लें",
  "contactPopup.actions.submit": "पूछताछ भेजें",
  "adminPanel.leads.title": "लीड प्रबंधन",
  "adminPanel.promotions.title": "प्रमोशन अनुरोध",
  "buyerPanel.topBar.wishlist.title": "विशलिस्ट",
  "buyerPanel.topBar.compare.title": "तुलना",
  "buyerPanel.topBar.cart.title": "कार्ट",
  "agentPanel.topBar.dashboard.title": "अवलोकन",
};

for (const [p, v] of Object.entries(hiFlat)) setHi(p, v);

function mergeLocale(lang, additions) {
  const file = path.join(localesDir, lang, "translation.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [key, value] of Object.entries(additions)) {
    if (data[key] && typeof data[key] === "object" && typeof value === "object") {
      data[key] = { ...data[key], ...value };
    } else {
      data[key] = value;
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${lang}/translation.json`);
}

mergeLocale("en", additionsEn);
mergeLocale("hi", additionsHi);
