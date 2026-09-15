"use client";

import { STANDARD_SHELF_LISTS, useCart } from "@/components/cart/cart-context";
import { trackCoruEvent } from "@/lib/analytics";

interface AddToCartButtonProps {
  slug: string;
  placement?: "catalogo" | "ficha";
  compact?: boolean;
}

export function AddToCartButton({
  slug,
  placement = "ficha",
  compact = false,
}: AddToCartButtonProps) {
  const { add, setStatus, toggleCustomList, items, lists } = useCart();
  const item = items.find((entry) => entry.slug === slug);
  const customLists = lists.filter((list) => list.isCustom);

  function chooseStatus(statusId: string) {
    if (item) {
      setStatus(slug, statusId);
      trackCoruEvent("shelf_move", { product: slug, list: statusId, placement });
      return;
    }
    add(slug, statusId);
    trackCoruEvent("shelf_add", { product: slug, list: statusId, placement });
  }

  if (compact && !item) {
    return (
      <button
        className="add-button add-button--compact"
        type="button"
        onClick={() => chooseStatus("por-leer")}
        aria-label="Guardar en Por leer"
        title="Guardar en Por leer"
      >
        <span aria-hidden="true">+</span>
      </button>
    );
  }

  if (compact && item) {
    return (
      <label className="shelf-mini-picker">
        <span className="sr-only">Balda</span>
        <select
          aria-label="Cambiar de balda"
          value={item.statusId}
          onChange={(event) => chooseStatus(event.target.value)}
        >
          {STANDARD_SHELF_LISTS.map((list) => <option key={list.id} value={list.id}>{list.label}</option>)}
        </select>
      </label>
    );
  }

  return (
    <div className="detail-shelf-picker">
      <div>
        <p className="eyebrow">Estado de lectura</p>
        <p>Elige uno. Podrás cambiarlo cuando cambie tu momento.</p>
      </div>
      <div className="detail-shelf-picker__options" role="group" aria-label="Elegir estado de lectura">
        {STANDARD_SHELF_LISTS.map((list) => (
          <button
            key={list.id}
            type="button"
            aria-pressed={item?.statusId === list.id}
            onClick={() => chooseStatus(list.id)}
          >
            {list.label}
          </button>
        ))}
      </div>
      {customLists.length > 0 && (
        <div className="detail-custom-lists">
          <div><p className="eyebrow">También en tus listas</p><p>Puedes marcar todas las que quieras.</p></div>
          <div className="detail-custom-lists__options" role="group" aria-label="Añadir a listas personales">
            {customLists.map((list) => (
              <button key={list.id} type="button" aria-pressed={item?.customListIds.includes(list.id) ?? false} onClick={() => {
                toggleCustomList(slug, list.id);
                trackCoruEvent("shelf_custom_toggle", { product: slug, list: list.id, placement });
              }}>{list.label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
