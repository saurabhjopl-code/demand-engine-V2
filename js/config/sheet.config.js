export const SHEETS = [
  {
    key: "sales",
    name: "Sales",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=928000883&single=true&output=csv",
    headers: ["Month","MP Account","FC","MP SKU","Uniware SKU","Style ID","Size","Units"]
  },
  {
    key: "stock",
    name: "Stock",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=1380535833&single=true&output=csv",
    headers: ["FC","MP SKU","Uniware SKU","Style ID","Size","Units"]
  },
  {
    key: "styleStatus",
    name: "Style Status",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=9418502&single=true&output=csv",
    headers: ["Style ID","Category","Company Remark"]
  },
  {
    key: "saleDays",
    name: "Sale Days",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=46718869&single=true&output=csv",
    headers: ["Month","Days"]
  },
  {
    key: "sizeCount",
    name: "Size Count",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=1368985173&single=true&output=csv",
    headers: ["Style ID","Size","Count"]
  },
  {
    key: "production",
    name: "Production",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=1281323624&single=true&output=csv",
    headers: ["Uniware SKU","In Production"]
  },
  {
    key: "meterCalc",
    name: "Meter Calc",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=474570014&single=true&output=csv",
    headers: ["Uniware SKU","Size","TOP (M)","BOTTOM (M)","DUPATTA (M)"]
  },
  {
    key: "location",
    name: "Location",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=701072053&single=true&output=csv",
    headers: ["Uniware SKU","Location"]
  },
  {
    key: "xMarkUp",
    name: "X Mark Up",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9UMGb9GMFpOrcTTV1yeN4VLudTFeVy97_09T7-SIyvXDsMFypBgqyZWVQitbJi0I5IenBb0skv9UQ/pub?gid=862982464&single=true&output=csv",
    headers: ["Company Remark","Surat","Jaipur"]
  }
];
