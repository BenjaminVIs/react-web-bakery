/**
 * Utilidades puras relacionadas con la lógica de negocio de pedidos.
 *
 * Objetivos:
 * - Centralizar definición de estados permitidos y transiciones válidas.
 * - Migrar/normalizar estados legacy provenientes de versiones anteriores.
 * - Proveer helpers de validación y cálculo (total, montos, UUID) fácilmente testeables.
 * - Formatear valores monetarios en CLP (sin decimales) de forma consistente.
 *
 * Todas las funciones son puras (sin efectos secundarios) para facilitar su testeo
 * con Jasmine/Karma y eventual reutilización en otros componentes o servicios.
 */

// Estados permitidos (constraint)
/** Lista de estados válidos (constraint en la tabla orders). */
export const STATUS_ALLOWED = ["pending", "paid", "cancelled"];

// Map de estados legacy -> nuevos
/**
 * Mapa de estados legacy -> estados actuales.
 * Permite migrar automáticamente registros antiguos al cargar la data.
 */
export const LEGACY_STATUS_MAP = {
  pendiente: "pending",
  en_preparacion: "paid",
  processing: "paid",
  completado: "paid",
  completed: "paid",
  cancelado: "cancelled"
};

// Transiciones permitidas entre estados
// pending -> paid | cancelled
// paid -> cancelled (posible reembolso)
// cancelled -> (no cambia)
/**
 * Transiciones permitidas entre estados.
 * Se usa para validar cambios y para listar opciones disponibles en edición.
 */
export const STATUS_TRANSITIONS = {
  pending: ["paid", "cancelled"],
  paid: ["cancelled"],
  cancelled: []
};

/**
 * Normaliza un estado (si es legacy lo convierte al valor actual).
 * @param {string} status Estado original (legacy o actual).
 * @returns {string} Estado normalizado dentro de STATUS_ALLOWED si aplica.
 */
export function normalizeStatus(status) {
  return LEGACY_STATUS_MAP[status] || status;
}

/**
 * Indica si una transición de estado es válida según STATUS_TRANSITIONS.
 * @param {string} from Estado original.
 * @param {string} to  Estado destino.
 * @returns {boolean} true si la transición está permitida.
 */
export function canTransition(from, to) {
  if (from === to) return true;
  const allowed = STATUS_TRANSITIONS[from] || [];
  return allowed.includes(to);
}

/**
 * Retorna la lista de opciones de estado disponibles dado el estado actual.
 * Siempre incluye el estado actual para permitir permanecer en él.
 * @param {string|null} current Estado actual del pedido.
 * @param {string[]} [all] Lista completa de estados (por defecto STATUS_ALLOWED).
 * @returns {string[]} Opciones de estado.
 */
export function allowedStatusOptions(current, all = STATUS_ALLOWED) {
  if (!current) return all;
  const transitions = STATUS_TRANSITIONS[current];
  if (!transitions) return all;
  return [current, ...transitions];
}

/**
 * Calcula el total mostrable aplicando la resta (subtotal - descuento).
 * Recibe strings para facilitar el uso directo desde inputs controlados.
 * @param {string} subtotalStr Subtotal en formato string.
 * @param {string} discountStr Descuento en formato string.
 * @returns {string} Total sin decimales.
 */
export function calcTotalDisplay(subtotalStr, discountStr) {
  const subtotal = parseFloat(subtotalStr || "0");
  const discount = parseFloat(discountStr || "0");
  return (subtotal - discount).toFixed(0);
}

/**
 * Valida un UUID v4 (formato estándar) usado como user_id.
 * @param {string} val Valor a validar.
 * @returns {boolean} true si el formato coincide.
 */
export function isValidUUID(val) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

/**
 * Formatea un número en pesos chilenos (CLP) sin decimales.
 * Retorna '-' si el valor no es numérico.
 * @param {number} value Cantidad en pesos (ej: 15000).
 * @returns {string} Valor formateado (ej: "$15.000").
 */
export function formatCLP(value) {
  if (value == null || isNaN(value)) return "-";
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);
}

/**
 * Valida reglas de negocio para subtotal y descuento.
 * @param {string|number} subtotalStr Subtotal.
 * @param {string|number} discountStr Descuento.
 * @returns {{ok:boolean,message?:string}} Resultado de validación.
 */
export function validateAmounts(subtotalStr, discountStr) {
  const subtotal = Number(subtotalStr || 0);
  const discount = Number(discountStr || 0);
  if (subtotal < 0) return { ok: false, message: "Subtotal no puede ser negativo" };
  if (discount < 0) return { ok: false, message: "Descuento no puede ser negativo" };
  if (discount > subtotal) return { ok: false, message: "Descuento no puede superar subtotal" };
  return { ok: true };
}
