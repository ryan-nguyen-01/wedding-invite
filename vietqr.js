/* Sinh nội dung VietQR (chuẩn EMVCo/NAPAS) ngay trên trình duyệt — không gửi STK đi đâu cả. */
(function () {
  const BANKS = {
    VCB: ["970436", "Vietcombank"], CTG: ["970415", "VietinBank"], BIDV: ["970418", "BIDV"],
    AGR: ["970405", "Agribank"], TCB: ["970407", "Techcombank"], MB: ["970422", "MBBank"],
    ACB: ["970416", "ACB"], VPB: ["970432", "VPBank"], TPB: ["970423", "TPBank"],
    STB: ["970403", "Sacombank"], VIB: ["970441", "VIB"], SHB: ["970443", "SHB"],
    HDB: ["970437", "HDBank"], OCB: ["970448", "OCB"], MSB: ["970426", "MSB"],
    SEAB: ["970440", "SeABank"], LPB: ["970449", "LPBank"], EIB: ["970431", "Eximbank"],
    NAB: ["970428", "Nam A Bank"], BAB: ["970409", "Bac A Bank"], ABB: ["970425", "ABBANK"],
    PVCB: ["970412", "PVcomBank"], KLB: ["970452", "KienlongBank"], NCB: ["970419", "NCB"]
  };
  const tlv = (id, v) => id + String(v.length).padStart(2, "0") + v;
  function crc16(s) {
    let c = 0xffff;
    for (let i = 0; i < s.length; i++) {
      c ^= s.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff;
    }
    return c.toString(16).toUpperCase().padStart(4, "0");
  }
  function payload(bankCode, account, note) {
    const bank = BANKS[bankCode];
    if (!bank) return null;
    const merchant = tlv("00", "A000000727") + tlv("01", tlv("00", bank[0]) + tlv("01", account)) + tlv("02", "QRIBFTTA");
    let p = tlv("00", "01") + tlv("01", "11") + tlv("38", merchant) + tlv("53", "704") + tlv("58", "VN");
    if (note) p += tlv("62", tlv("08", note));
    p += "6304";
    return p + crc16(p);
  }
  const api = { BANKS, payload, crc16, bankName: c => (BANKS[c] || [null, ""])[1] };
  if (typeof module !== "undefined") module.exports = api; else window.VietQR = api;
})();
