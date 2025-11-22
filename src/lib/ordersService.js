import { supabase } from "./supabaseClient";
import { normalizeStatus, LEGACY_STATUS_MAP, STATUS_ALLOWED } from "./ordersUtils";

/**
 * Servicio de acceso a datos para la tabla `orders`.
 *
 * Objetivos:
 * - Encapsular llamadas al SDK de Supabase (select/insert/update/delete).
 * - Permitir migrar estados legacy sin exponer lógica en el componente.
 * - Facilitar reemplazo futuro por Edge Functions / RPC / fetch a API versionada.
 * - Simplificar el mocking en tests (cada función aislada devuelve/lanza datos).
 */

/**
 * Obtiene todos los pedidos ordenados por id ascendente.
 * @returns {Promise<Array>} Lista de registros de orders.
 * @throws Supabase error si la consulta falla.
 */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("id,user_id,status,subtotal_cents,discount_cents,total_cents,coupon_code,created_at")
    .order("id", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Migra estados legacy presentes en la data ya obtenida.
 * Nota: Mutamos el array recibido para reflejar inmediatamente el nuevo estado.
 * @param {Array} rows Lista de pedidos (resultado de fetchOrders).
 * @returns {Promise<Array>} Misma lista, con estados normalizados si aplica.
 */
export async function migrateLegacyStatuses(rows) {
  const legacyRows = rows.filter(r => LEGACY_STATUS_MAP[r.status]);
  for (const row of legacyRows) {
    const newCode = normalizeStatus(row.status);
    try {
      await supabase.from("orders").update({ status: newCode }).eq("id", row.id);
      row.status = newCode; // reflejamos el cambio localmente
    } catch (e) {
      console.error("[ordersService] fallo migracion", row.id, row.status, e);
    }
  }
  return rows;
}

/**
 * Crea un nuevo pedido.
 * @param {Object} payload Campos para insertar (user_id, status, *_cents, coupon_code).
 * @throws Supabase error si la inserción falla.
 */
export async function createOrder(payload) {
  const { error } = await supabase.from("orders").insert(payload);
  if (error) throw error;
}

/**
 * Actualiza un pedido existente.
 * @param {number} id Identificador del pedido.
 * @param {Object} payload Campos a actualizar.
 * @throws Supabase error si la actualización falla.
 */
export async function updateOrder(id, payload) {
  const { error } = await supabase.from("orders").update(payload).eq("id", id);
  if (error) throw error;
}

/**
 * Elimina un pedido por id.
 * @param {number} id Identificador del pedido.
 * @throws Supabase error si el borrado falla.
 */
export async function deleteOrder(id) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Garantiza que el estado propuesto esté dentro de STATUS_ALLOWED.
 * @param {string} status Estado candidato.
 * @returns {string} Estado seguro (fallback a 'pending').
 */
export function sanitizeStatus(status) {
  return STATUS_ALLOWED.includes(status) ? status : "pending";
}
