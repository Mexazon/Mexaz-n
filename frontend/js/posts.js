// js/posts.js

import { renderPepperRating } from "./peppers-rendering.js";
import { getTimeAgo } from "./dateUtils.js";
import { getFeedPosts } from "./controllers/getControllers.js";

const list = document.getElementById("reviews");
const statusBox = document.getElementById("feedStatus");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const loadMoreSpinner = document.getElementById("loadMoreSpinner");

let currentPage = 0;
let totalPages = 1;
let isLoading = false;
const PAGE_SIZE = 9;

/* -------------------------
   Utils DOM
--------------------------*/
const create = (tag, attrs = {}) =>
  Object.assign(document.createElement(tag), attrs);

function setStatus(message, type = "info") {
  statusBox.innerHTML = `
    <div class="alert alert-${type} d-flex align-items-center py-2 px-3" role="alert">
      <i class="bi ${iconFor(type)} me-2"></i>
      <div class="small">${message}</div>
    </div>`;
}
function clearStatus() {
  statusBox.innerHTML = "";
}
function iconFor(type) {
  switch (type) {
    case "success":
      return "bi-check-circle-fill";
    case "warning":
      return "bi-exclamation-triangle-fill";
    case "danger":
      return "bi-x-circle-fill";
    default:
      return "bi-info-circle-fill";
  }
}

/* -------------------------
   Adapter de datos
--------------------------*/
function mapPostToCardModel(post) {
  const author = post.author || {};
  const authorId = post.authorUserId ?? author.userId ?? post.userId ?? null;

  const authorName =
    post.authorName ??
    author.userName ??
    author.username ??
    author.name ??
    `user_${authorId ?? "anon"}`;

  const businessName =
    post.businessName ??
    (post.business && post.business.name) ??
    `Negocio #${post.reviewedBusinessId ?? post.businessId ?? "?"}`;

  return {
    idResenia: post.postId ?? post.id ?? cryptoRandomId(),
    usuario: {
      id: authorId,
      name: authorName,
    },
    lugar: businessName,
    calificacion: post.rating ?? post.score ?? 0,
    descripcion: post.description ?? post.content ?? "",
    createdAt: post.createdAt ?? post.created_at ?? new Date().toISOString(),
  };
}

function cryptoRandomId() {
  return `tmp_${Math.random().toString(36).slice(2, 10)}`;
}

/* -------------------------
   Helper para extraer la estructura de Page<>
--------------------------*/
function extractPagePayload(res) {
  if (Array.isArray(res)) {
    return { items: res, page: 0, totalPages: res.length ? 1 : 0 };
  }
  const items =
    (res && Array.isArray(res.content) && res.content) ||
    (res && Array.isArray(res.items) && res.items) ||
    (res &&
      res._embedded &&
      Array.isArray(res._embedded.posts) &&
      res._embedded.posts) ||
    [];
  const page =
    (res &&
      (Number.isInteger(res.number)
        ? res.number
        : Number.isInteger(res.page)
        ? res.page
        : 0)) ||
    0;
  const totalPages =
    (res &&
      (Number.isInteger(res.totalPages)
        ? res.totalPages
        : Number.isInteger(res.pageCount)
        ? res.pageCount
        : items.length
        ? 1
        : 0)) ||
    0;
  return { items, page, totalPages };
}

/* -------------------------
   Render de tarjeta sin fotos
--------------------------*/
function renderReview(r, size, container) {
  const col = create("div", { className: `${size}` });

  col.innerHTML = `
    <div class="card shadow-sm mb-3 border border-dark-subtle bg-cebolla card-review"
         id="${r.idResenia}"
         data-user-id="${r.usuario.id ?? ""}">
      <div class="card-header">
        <div class="d-flex align-items-center flex-wrap text-truncate small">
          <strong class="ordinary-user">@${r.usuario.name}</strong>
          <span class="text-muted ms-1">hizo una reseña a un nuevo puesto</span>
        </div>
      </div>

      <div class="card-body p-3">
        <div class="fw-semibold text-truncate business-user mb-1">${
          r.lugar
        }</div>
        <div class="pepper-rating mb-2" aria-label="picante"></div>
        <p class="small text-muted mb-2">${r.descripcion ?? ""}</p>
        <span class="text-muted small">${getTimeAgo(r.createdAt)}</span>
      </div>
    </div>`;

  container.appendChild(col);
  renderPepperRating(col.querySelector(".pepper-rating"), r.calificacion, 5);
}

/* -------------------------
   Carga de páginas
--------------------------*/
async function loadPage(page) {
  if (isLoading) return;
  isLoading = true;

  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreSpinner.classList.remove("d-none");
  }

  if (page === 0) {
    setStatus(`Cargando reseñas <span class="spinner-inline"></span>`, "info");
  }

  try {
    const res = await getFeedPosts(page, PAGE_SIZE);
    const { items, page: pageNum, totalPages: total } = extractPagePayload(res);

    if (!Array.isArray(items)) {
      console.warn("La respuesta no trae una lista iterable:", res);
      setStatus("No se pudo interpretar la respuesta del feed.", "danger");
      hideLoadMoreIfNeeded();
      return;
    }

    currentPage = pageNum ?? page;
    totalPages = total ?? 1;

    if (!items || items.length === 0) {
      if (page === 0) {
        setStatus("Aún no hay reseñas para mostrar.", "warning");
      }
      hideLoadMoreIfNeeded();
      return;
    }

    const sizeClass = "col-12 col-xl-4 col-lg-6";
    for (const post of items) {
      const vm = mapPostToCardModel(post);
      renderReview(vm, sizeClass, list);
    }

    clearStatus();

    if (currentPage >= totalPages - 1) {
      hideLoadMoreIfNeeded();
    } else {
      showLoadMore();
    }
  } catch (err) {
    console.error("❌ Error cargando feed:", err);
    setStatus("No se pudo cargar el feed. Reintenta más tarde.", "danger");
    hideLoadMoreIfNeeded();
  } finally {
    isLoading = false;
    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreSpinner.classList.add("d-none");
    }
  }
}

function hideLoadMoreIfNeeded() {
  if (loadMoreBtn) {
    loadMoreBtn.classList.add("d-none");
  }
}
function showLoadMore() {
  if (loadMoreBtn) {
    loadMoreBtn.classList.remove("d-none");
  }
}

/* -------------------------
   Eventos
--------------------------*/
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    if (isLoading) return;
    if (currentPage >= totalPages - 1) return;
    loadPage(currentPage + 1);
  });
}

list.addEventListener("click", (event) => {
  const userEl = event.target.closest(".ordinary-user");
  if (userEl) {
    const card = userEl.closest(".card");
    if (card) {
      const userId = card.dataset.userId;
      if (userId) window.location.href = `user_profile.html?id=${userId}`;
    }
  }
});

/* -------------------------
   Carga inicial
--------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  list.innerHTML = "";
  currentPage = 0;
  totalPages = 1;
  showLoadMore();
  loadPage(0);
});
