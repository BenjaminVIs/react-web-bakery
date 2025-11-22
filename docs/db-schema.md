# Esquema de Base de Datos

## Tablas

### user_profile
| Columna       | Tipo      | Notas                                      |
|---------------|-----------|--------------------------------------------|
| user_id       | UUID      | PK, referencia de usuario Supabase auth    |
| display_name  | TEXT      | Nombre mostrado                            |
| role          | TEXT      | CHECK IN ('admin','vendedor','cliente')    |
| created_at    | TIMESTAMPTZ | DEFAULT now()                            |

### orders
| Columna        | Tipo      | Notas                                                        |
|----------------|-----------|--------------------------------------------------------------|
| id             | BIGINT    | PK identity                                                  |
| user_id        | UUID      | FK -> user_profile.user_id (ON DELETE CASCADE)               |
| status         | TEXT      | CHECK IN ('pending','paid','cancelled')                      |
| subtotal_cents | INT       | >= 0                                                         |
| discount_cents | INT       | >= 0, <= subtotal_cents                                      |
| total_cents    | INT       | subtotal_cents - discount_cents                              |
| coupon_code    | TEXT NULL | Código opcional                                              |
| created_at     | TIMESTAMPTZ | DEFAULT now()                                              |

## Diagrama
```
 user_profile                      orders
 -------------                     -----------------------------
 user_id (PK) <------------------  user_id (FK)
 display_name                      id (PK)
 role                              status
 created_at                        subtotal_cents
                                   discount_cents
                                   total_cents
                                   coupon_code
                                   created_at
```

## Estados y Transiciones
- pending -> paid | cancelled
- paid -> cancelled
- cancelled -> (no cambia)

Estados legacy mapeados automáticamente:
```
pendiente -> pending
en_preparacion, processing, completado, completed -> paid
cancelado -> cancelled
```

## Reglas de Validación
1. `subtotal_cents >= 0`
2. `discount_cents >= 0`
3. `discount_cents <= subtotal_cents`
4. `total_cents = subtotal_cents - discount_cents`

## Roles
| Rol       | Permisos principales                                   |
|-----------|--------------------------------------------------------|
| admin     | CRUD completo pedidos                                  |
| vendedor  | Ver listado/detalle pedidos (sin modificar)            |
| cliente   | Acceso solo a tienda (no vista administración)         |

## Futuras Extensiones
- Tabla `order_items` para desglose (FK a orders).
- Tabla `products` para catálogo.
- RLS (Row Level Security) en Supabase para reforzar roles.
- Edge Functions / RPC para operaciones críticas (cálculos, reportes).
