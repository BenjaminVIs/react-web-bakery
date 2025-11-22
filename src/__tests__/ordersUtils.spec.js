import {
  calcTotalDisplay,
  validateAmounts,
  normalizeStatus,
  canTransition,
  allowedStatusOptions
} from "../lib/ordersUtils.js";

describe("ordersUtils", () => {
  describe("calcTotalDisplay", () => {
    it("resta descuento del subtotal", () => {
      expect(calcTotalDisplay("1000", "200")).toBe("800");
    });
    it("maneja strings vacíos como cero", () => {
      expect(calcTotalDisplay("", "")).toBe("0");
    });
  });

  describe("validateAmounts", () => {
    it("acepta valores válidos", () => {
      expect(validateAmounts("1000", "200").ok).toBeTrue();
    });
    it("rechaza descuento mayor que subtotal", () => {
      const r = validateAmounts("100", "200");
      expect(r.ok).toBeFalse();
      expect(r.message).toContain("superar subtotal");
    });
    it("rechaza negativos", () => {
      expect(validateAmounts("-1", "0").ok).toBeFalse();
      expect(validateAmounts("10", "-2").ok).toBeFalse();
    });
  });

  describe("normalizeStatus", () => {
    it("convierte legacy a nuevo", () => {
      expect(normalizeStatus("pendiente")).toBe("pending");
      expect(normalizeStatus("completado")).toBe("paid");
    });
    it("retorna ya normalizado", () => {
      expect(normalizeStatus("paid")).toBe("paid");
    });
  });

  describe("canTransition", () => {
    it("permite permanecer en mismo estado", () => {
      expect(canTransition("pending", "pending")).toBeTrue();
    });
    it("permite pending -> paid", () => {
      expect(canTransition("pending", "paid")).toBeTrue();
    });
    it("bloquea cancelled -> paid", () => {
      expect(canTransition("cancelled", "paid")).toBeFalse();
    });
  });

  describe("allowedStatusOptions", () => {
    it("incluye estado actual y transiciones", () => {
      const opts = allowedStatusOptions("pending");
      expect(opts).toEqual(["pending", "paid", "cancelled"]);
    });
    it("cancelled solo retorna cancelled", () => {
      const opts = allowedStatusOptions("cancelled");
      expect(opts).toEqual(["cancelled"]);
    });
  });
});
