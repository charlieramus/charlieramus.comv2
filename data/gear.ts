// Photography gear. Seeded from the current site. CUSTOMIZE names/notes/links.

export type GearItem = {
  name: string;
  /** short note, e.g. "Primary body" ("" hides) */
  note: string;
  /** manufacturer/retailer URL ("" hides link) */
  href: string;
};

export const gear: Record<string, GearItem[]> = {
  bodies: [
    { name: "Canon EOS R5", note: "Primary body", href: "https://www.bhphotovideo.com/c/product/1547009-REG/canon_4147c002_eos_r5_mirrorless_camera.html/?ap=y&ap=y&smp=y&smp=y&store=420&lsft=BI%3A6879&gad_source=1&gad_campaignid=21076579605&gbraid=0AAAAAD7yMh0-OFrE43zjBuUbJxSYRsB-k&gclid=Cj0KCQjwsMLSBhD9ARIsAIpUTDrsOvxuYPfYhgujaOTr7umJ6ZcT5SYAY8oEGm4llxfsHFITBwXFmPEaAvPAEALw_wcB" },
    { name: "DJI Air 2s Combo", note: "Primary drone (Look at 3s for current pricing options", href: "https://www.bhphotovideo.com/c/product/1632435-REG/dji_cp_ma_00000354_01_air_2s_drone.html" },
  ],
  lenses: [
    { name: "Canon RF 24-105mm f/4", note: "", href: "https://www.bhphotovideo.com/c/product/1433712-REG/canon_rf_24_105mm_f_4l_is.html" },
    { name: "Sigma 150-600mm f/5.6-6.3", note: "", href: "https://www.keh.com/shop/sigma-150-600mm-f-5-6-3-dg-os-hsm-c-contemporary-lens-for-canon-ef-mount-95-1.html?aid=369805-2306724&nbt=nb%3Aadwords%3Ag%3A23090482546%3A186818604415%3A777581404268&nb_adtype=pla&nb_kwd=&nb_ti=pla-58923981526&nb_mi=7115600&nb_pc=online&nb_pi=369805-2306724&nb_ppi=58923981526&nb_placement=&nb_li_ms=&nb_lp_ms=&nb_fii=&nb_ap=&nb_mt=&gad_source=1&gad_campaignid=23090482546&gbraid=0AAAAAD_vFQvaBTCE9BTS2TOimjO0p2iiS&gclid=Cj0KCQjwsMLSBhD9ARIsAIpUTDq26MkxhwO3mS4Vc4fLGkW9Xze1NC7UK9MTz898uBRUXVeiOgPwxZwaAiYJEALw_wcB" },
  ],
  bags: [
    { name: "Kiboko V2.0 30L+", note: "Long travel / high capacity", href: "https://www.bhphotovideo.com/c/product/1751846-REG/gura_gear_gg0533_1945_kiboko_2_0_30l_backpack.html/?ap=y&ap=y&smp=y&smp=y&store=420&smpm=ba_f2_lar&lsft=BI%3A6879&gad_source=1&gad_campaignid=20000463050&gbraid=0AAAAAD7yMh2suwTirxA6MJn2Zkdb2Rg6j&gclid=Cj0KCQjwsMLSBhD9ARIsAIpUTDpGE_4bJEwCx7pe5jlzrBEFc_EbeLDpQ-UYwbbQ4uWmuhfXCvaLe8MaAkviEALw_wcB" },
    { name: "Thule Aspect V2", note: "Everyday carry", href: "https://www.thule.com/en-am/backpacks/camera-backpacks-bags/thule-aspect-dslr-backpack-_-tl_85854238717" },
  ],
  accessories: [
    { name: "Carbon-fiber tripod", note: "", href: "https://www.bhphotovideo.com/c/product/1709952-REG/k_f_concept_kf09_094v1_carbon_fiber_tripod.html" },
    { name: "Deity V-Mic D4 Mini", note: "", href: "https://www.bhphotovideo.com/c/product/1654686-REG/deity_microphones_v_mic_d4_mini_ultracompact.html" },
  ],
};

export const gearSections: { key: keyof typeof gear; label: string }[] = [
  { key: "bodies", label: "Camera Bodies" },
  { key: "lenses", label: "Lenses" },
  { key: "bags", label: "Bags" },
  { key: "accessories", label: "Accessories" },
];
