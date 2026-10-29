export interface PincodeZone {
    pincode: string;
    area: string;
    city: "Thane" | "Mumbai";
    deliverySlot: string;
  }
  
  export const SERVICEABLE_PINCODES: Record<string, PincodeZone> = {
    // Thane Prime Zones
    "400601": { pincode: "400601", area: "Thane West (Gokhale Road / Station)", city: "Thane", deliverySlot: "5:00 AM – 7:30 AM" },
    "400602": { pincode: "400602", area: "Thane West (Naupada / Panchpakhadi)", city: "Thane", deliverySlot: "5:00 AM – 7:30 AM" },
    "400603": { pincode: "400603", area: "Thane East (Kopri)", city: "Thane", deliverySlot: "5:30 AM – 8:00 AM" },
    "400604": { pincode: "400604", area: "Wagle Estate / Teen Hath Naka", city: "Thane", deliverySlot: "5:30 AM – 8:00 AM" },
    "400606": { pincode: "400606", area: "Vartak Nagar / Pokhran Road No. 1", city: "Thane", deliverySlot: "5:00 AM – 7:30 AM" },
    "400607": { pincode: "400607", area: "Ghodbunder Road / Manpada / Chitalsar", city: "Thane", deliverySlot: "5:00 AM – 7:30 AM" },
    "400610": { pincode: "400610", area: "Majiwada / Balkum / Kapurbawdi", city: "Thane", deliverySlot: "5:00 AM – 7:30 AM" },
    "400615": { pincode: "400615", area: "Hiranandani Estate / Kasarvadavali", city: "Thane", deliverySlot: "5:00 AM – 7:30 AM" },
    // Mumbai Suburbs & Central
    "400080": { pincode: "400080", area: "Mulund West", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400081": { pincode: "400081", area: "Mulund East", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400078": { pincode: "400078", area: "Bhandup West", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400076": { pincode: "400076", area: "Powai / Hiranandani Gardens", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400077": { pincode: "400077", area: "Ghatkopar East", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400014": { pincode: "400014", area: "Dadar East / Matunga", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400028": { pincode: "400028", area: "Dadar West / Shivaji Park", city: "Mumbai", deliverySlot: "5:30 AM – 8:00 AM" },
    "400053": { pincode: "400053", area: "Andheri West", city: "Mumbai", deliverySlot: "6:00 AM – 8:00 AM" },
    "400092": { pincode: "400092", area: "Borivali West", city: "Mumbai", deliverySlot: "6:00 AM – 8:00 AM" },
  };
  
  export function checkPincodeAvailability(rawInput: string): {
    valid: boolean;
    serviceable: boolean;
    zone?: PincodeZone;
    message: string;
  } {
    const cleaned = rawInput.trim().replace(/\D/g, "");
  
    if (cleaned.length !== 6) {
      return {
        valid: false,
        serviceable: false,
        message: "Please enter a valid 6-digit Thane or Mumbai pincode.",
      };
    }
  
    // Exact match from curated dictionary
    if (SERVICEABLE_PINCODES[cleaned]) {
      const zone = SERVICEABLE_PINCODES[cleaned];
      return {
        valid: true,
        serviceable: true,
        zone,
        message: `🎉 Great news! We deliver fresh puja flowers in ${zone.area} (${zone.city}) every morning between ${zone.deliverySlot}.`,
      };
    }
  
    // Fallback for broader Thane (4006xx) and Mumbai (4000xx) ranges
    if (cleaned.startsWith("4006") || cleaned.startsWith("4000")) {
      const city = cleaned.startsWith("4006") ? "Thane" : "Mumbai";
      const zone: PincodeZone = {
        pincode: cleaned,
        area: `${city} Sector (${cleaned})`,
        city,
        deliverySlot: "5:00 AM – 8:00 AM",
      };
      return {
        valid: true,
        serviceable: true,
        zone,
        message: `🎉 Available! Morning 5:00 AM – 8:00 AM flower delivery is active for pincode ${cleaned} (${city}).`,
      };
    }
  
    return {
      valid: true,
      serviceable: false,
      message:
        "We currently serve only Thane & Mumbai (400xxx pincodes). Expanding to your neighborhood soon!",
    };
  }