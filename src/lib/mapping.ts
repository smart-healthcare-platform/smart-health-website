export const mapDegreeTitle = (degree?: string) => {
    switch (degree) {
      case "BACHELOR": return "Cử nhân";
      case "MASTER": return "Thạc sĩ";
      case "MD": return "Bác sĩ";
      case "PHD": return "Tiến sĩ";
      case "SPECIALIST_I": return "BSCKI";
      case "SPECIALIST_II": return "BSCKII";
      default: return "Không xác định";
    }
  };
  