import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Beef,
  Bike,
  Clock,
  CupSoda,
  Instagram,
  MapPin,
  MessageCircle,
  Minus,
  Play,
  Plus,
  ShoppingBasket,
  X,
} from "lucide-react";

import logoImg from "@/assets/logo.jpg";
import pastaNapolitanaImg from "@/assets/pasta-napolitana.jpg";
import pastaBechamelImg from "@/assets/pasta-bechamel.jpg";
import pastaFidelioImg from "@/assets/pasta-fidelio.jpg";
import pastaMarineraPlatoImg from "@/assets/pasta-marinera-plato.jpg";
import pechugaNapolitanaImg from "@/assets/pechuga-napolitana.jpg";
import sanducheImg from "@/assets/sanduche-fidelio.jpg";
import hamburguesaImg from "@/assets/hamburguesa.jpg";
import localImg from "@/assets/pasta-marinera.jpg";
import limonadaNaturalImg from "@/assets/limonada-natural.png";
import limonadaCerezadaImg from "@/assets/limonada-cerezada.png";
import limonadaCocoImg from "@/assets/limonada-coco.png";
import jugosImg from "@/assets/jugos.png";
import gaseosaImg from "@/assets/gaseosa.png";
import churrascoImg from "@/assets/churrasco.jpg";
import aguaConGasImg from "@/assets/agua-con-gas.png";
import aguaNaturalImg from "@/assets/agua-natural.png";
import promoImg from "@/assets/promo-mientras-vivo.jpg";

const WHATSAPP_NUMBER = "573170549739";
const WHATSAPP_DISPLAY = "317 054 9739";
const INSTAGRAM_URL = "https://www.instagram.com/fideliopasta/";
const ADDRESS = "Calle 47 # 22-08, Altamira, Palmira";
const HOURS = "4:00 p. m. a 11:00 p. m.";
const TIKTOK_VIDEO_URL = "https://www.tiktok.com/@fidelio.mas.que.p/video/7686674711215934741";
const TIKTOK_VIDEO_ID = "7686674711215934741";
const TIKTOK_HANDLE = "@fidelio.mas.que.p";

function TikTokEmbed() {
  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${TIKTOK_VIDEO_ID}?autoplay=1&muted=1&loop=1`}
      allow="autoplay; encrypted-media; fullscreen"
      allowFullScreen
      className="aspect-[9/16] w-full rounded-3xl"
      style={{ border: 0 }}
      title={`Video de Fidelio en TikTok: ${TIKTOK_HANDLE}`}
    />
  );
}

type TikTokOEmbed = { thumbnail_url?: string; title?: string };

function TikTokFacade() {
  const [activated, setActivated] = useState(false);
  const [meta, setMeta] = useState<TikTokOEmbed | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(TIKTOK_VIDEO_URL)}`)
      .then((res) => res.json())
      .then((data: TikTokOEmbed) => {
        if (!cancelled) setMeta(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (activated) {
    return <TikTokEmbed />;
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label="Reproducir video de Fidelio en TikTok"
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
    >
      {meta?.thumbnail_url ? (
        <img
          src={meta.thumbnail_url}
          alt="Video de Fidelio en TikTok"
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-basil/20">
          <span className="text-sm text-muted-foreground">Cargando video…</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg transition-transform group-hover:scale-110">
          <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 text-left text-white">
        <p className="text-sm font-semibold">{TIKTOK_HANDLE}</p>
        <p className="mt-1 line-clamp-2 text-xs text-white/80">
          {meta?.title ?? "Míranos en TikTok"}
        </p>
      </div>
    </button>
  );
}

const PASTA_TYPES = ["Espagueti", "Fettuccine", "Penne"] as const;
type PastaType = (typeof PASTA_TYPES)[number];

const MILK_OPTIONS = ["Agua", "Leche"] as const;
type MilkOption = (typeof MILK_OPTIONS)[number];
const MILK_PRICE = 12000;

const JUGO_FLAVORS = [
  { name: "Mora", price: 10000 },
  { name: "Lulo", price: 10000 },
  { name: "Mango biche", price: 12000 },
  { name: "Maracuyá", price: 10000 },
  { name: "Guanábana", price: 12000 },
] as const;
type JugoFlavor = (typeof JUGO_FLAVORS)[number]["name"];
const JUGO_VARIANT_SEP = " · ";

type Variant = string;

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag?: string;
  category: "pastas" | "especiales" | "bebidas";
  image?: string;
  pastaChoice?: boolean;
  jugoCombo?: boolean;
  fallbackIcon?: typeof Beef;
};

const getUnitPrice = (product: Product, variant?: Variant) => {
  if (product.jugoCombo && variant) {
    const [, milk] = variant.split(JUGO_VARIANT_SEP);
    if (milk === "Leche") return MILK_PRICE;
    const flavor = variant.split(JUGO_VARIANT_SEP)[0];
    return JUGO_FLAVORS.find((f) => f.name === flavor)?.price ?? product.price;
  }
  return product.price;
};

const cartLabel = (product: Product, variant?: Variant) => {
  if (product.jugoCombo && variant) {
    const [flavor, milk] = variant.split(JUGO_VARIANT_SEP);
    return `Jugo de ${flavor} (${milk})`;
  }
  return variant ? `${product.name} (${variant})` : product.name;
};

const PRODUCTS: Product[] = [
  {
    id: "pasta-marinera",
    name: "Pasta Marinera",
    description: "Camarones tigre, palmito, mejillones, zumo de limón, perejil y parmesano.",
    price: 36000,
    tag: "Espagueti, fettuccine o penne",
    category: "pastas",
    image: pastaMarineraPlatoImg,
    pastaChoice: true,
  },
  {
    id: "pasta-napolitana",
    name: "Pasta Napolitana",
    description: "Salsa roja con carne molida.",
    price: 20000,
    tag: "Espagueti, fettuccine o penne",
    category: "pastas",
    image: pastaNapolitanaImg,
    pastaChoice: true,
  },
  {
    id: "pasta-bechamel",
    name: "Pasta Bechamel",
    description: "Salsa blanca con tocineta ahumada, jamón y maíz tierno.",
    price: 20000,
    tag: "Espagueti, fettuccine o penne",
    category: "pastas",
    image: pastaBechamelImg,
    pastaChoice: true,
  },
  {
    id: "pasta-fidelio",
    name: "Pasta Fidelio",
    description: "Salsa rosé con pollo desmechado.",
    price: 20000,
    tag: "Espagueti, fettuccine o penne",
    category: "pastas",
    image: pastaFidelioImg,
    pastaChoice: true,
  },
  {
    id: "sanduche",
    name: "Sánduche Fidelio",
    description:
      "Pan de orégano con salsa de la casa, jamón serrano, pepperoni, tocineta ahumada, rúgula, tomates con albahaca y selección de quesos madurados.",
    price: 22000,
    tag: "Incluye papas a la francesa",
    category: "especiales",
    image: sanducheImg,
  },
  {
    id: "hamburguesa",
    name: "Hamburguesa Fidelio",
    description:
      "Pan de orégano con salsa de la casa y napolitana, carne, pepperoni, queso muenster, cebolla caramelizada, rúgula y ripio de papa.",
    price: 25500,
    tag: "Incluye papas a la francesa",
    category: "especiales",
    image: hamburguesaImg,
  },
  {
    id: "pechuga-napolitana",
    name: "Pechuga Napolitana",
    description:
      "Pechuga bañada en salsa napolitana y queso muenster, acompañada de ensalada de la casa (lechuga crespa, vinagreta y frutos secos) y papa a la francesa.",
    price: 30000,
    tag: "Con ensalada y papas",
    category: "especiales",
    image: pechugaNapolitanaImg,
  },
  {
    id: "churrasco",
    name: "Churrasco",
    description: "Acompañado de papas a la francesa, ensalada de la casa y chimichurri.",
    price: 45000,
    tag: "Con papas y ensalada",
    category: "especiales",
    image: churrascoImg,
  },
  {
    id: "jugos",
    name: "Jugos naturales",
    description: "Elige tu fruta favorita y si la quieres en agua o en leche.",
    price: 10000,
    category: "bebidas",
    image: jugosImg,
    jugoCombo: true,
  },
  {
    id: "limonada-natural",
    name: "Limonada natural",
    description: "Limón fresco recién exprimido.",
    price: 10000,
    category: "bebidas",
    image: limonadaNaturalImg,
  },
  {
    id: "limonada-cerezada",
    name: "Limonada cerezada",
    description: "Limonada natural con toque de cereza.",
    price: 12000,
    category: "bebidas",
    image: limonadaCerezadaImg,
  },
  {
    id: "limonada-coco",
    name: "Limonada de coco",
    description: "Limonada natural con crema de coco.",
    price: 12000,
    category: "bebidas",
    image: limonadaCocoImg,
  },
  {
    id: "agua-con-gas",
    name: "Agua con gas",
    description: "Botella individual.",
    price: 5000,
    category: "bebidas",
    image: aguaConGasImg,
  },
  {
    id: "agua-sin-gas",
    name: "Agua sin gas",
    description: "Botella individual.",
    price: 5000,
    category: "bebidas",
    image: aguaNaturalImg,
  },
  {
    id: "gaseosa",
    name: "Gaseosa",
    description: "Coca-Cola sabor original, 500 ml.",
    price: 6000,
    category: "bebidas",
    image: gaseosaImg,
  },
];

const CATEGORIES = [
  { id: "todo", label: "Todo" },
  { id: "pastas", label: "Pastas" },
  { id: "especiales", label: "Especiales" },
  { id: "bebidas", label: "Bebidas" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const cartKey = (productId: string, variant?: Variant) =>
  variant ? `${productId}::${variant}` : productId;

const parseCartKey = (key: string) => {
  const [productId, variant] = key.split("::") as [string, Variant | undefined];
  return { productId, variant };
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIDELIO — Más que pasta, a domicilio en Palmira" },
      {
        name: "description",
        content:
          "Pastas, sánduches, hamburguesa y churrasco. Domicilios a toda Palmira de 4:00 p. m. a 11:00 p. m. Pide por WhatsApp.",
      },
      { property: "og:title", content: "FIDELIO — Más que pasta" },
      {
        property: "og:description",
        content:
          "Pastas, sánduches, hamburguesa y churrasco con domicilio a toda Palmira. Pide por WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [category, setCategory] = useState<CategoryId>("todo");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [pastaChoice, setPastaChoice] = useState<Record<string, PastaType>>({});
  const [jugoFlavor, setJugoFlavor] = useState<Record<string, JugoFlavor>>({});
  const [jugoMilk, setJugoMilk] = useState<Record<string, MilkOption>>({});
  const [promoOpen, setPromoOpen] = useState(false);
  const promoShownRef = useRef(false);
  const promoTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = promoTriggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !promoShownRef.current) {
          promoShownRef.current = true;
          setPromoOpen(true);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visible = useMemo(
    () => (category === "todo" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart).flatMap(([key, qty]) => {
        const { productId, variant } = parseCartKey(key);
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product || qty <= 0) return [];
        return [{ key, product, variant, qty }];
      }),
    [cart],
  );

  const total = cartItems.reduce(
    (sum, item) => sum + getUnitPrice(item.product, item.variant) * item.qty,
    0,
  );
  const count = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (productId: string, variant?: Variant) =>
    setCart((prev) => {
      const key = cartKey(productId, variant);
      return { ...prev, [key]: (prev[key] ?? 0) + 1 };
    });

  const removeFromCart = (key: string) =>
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[key] ?? 0) - 1;
      if (qty <= 0) delete next[key];
      else next[key] = qty;
      return next;
    });

  const orderOnWhatsApp = () => {
    const lines = cartItems.map((item) => {
      const label = cartLabel(item.product, item.variant);
      const unitPrice = getUnitPrice(item.product, item.variant);
      return `• ${item.qty} × ${label} — ${formatCOP(unitPrice * item.qty)}`;
    });
    const message = [
      "¡Hola! Quiero hacer un pedido:",
      "",
      ...lines,
      "",
      `Total: ${formatCOP(total)}`,
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center">
            <img src={logoImg} alt="Fidelio — Más que pasta" className="h-10 w-auto sm:h-12" />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#menu" className="transition-colors hover:text-foreground">Menú</a>
            <a href="#nosotros" className="transition-colors hover:text-foreground">Nosotros</a>
            <a href="#contacto" className="transition-colors hover:text-foreground">Contacto</a>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            <ShoppingBasket className="size-4" aria-hidden />
            Carrito
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-basil text-xs font-bold text-basil-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Más que pasta
            </p>
            <h1
              className="text-6xl uppercase leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              <span className="block text-foreground">Pastas</span>
              <span
                className="block text-primary"
                style={{ textShadow: "3px 3px 0 var(--basil)" }}
              >
                Fidelio
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Disfruta del auténtico sabor de la pasta en cada bocado. 🍝✨ Explora nuestro
              menú, haz tus pedidos de forma rápida y vive una experiencia culinaria única
              hecha con pasión y tradición. ¡Pide la tuya hoy!
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Ver el menú
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border bg-card px-7 py-3 font-semibold transition-colors hover:bg-accent"
              >
                Pedir por WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mx-auto w-full max-w-[360px] lg:mx-0 lg:justify-self-end"
          >
            <TikTokFacade />
          </motion.div>
        </div>
      </section>

      {/* Menú / catálogo */}
      <section id="menu" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl">Nuestro menú</h2>
            <p className="mt-2 text-muted-foreground">
              Todo se elabora en el día. Domicilios a toda Palmira.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  category === c.id
                    ? "bg-foreground text-background"
                    : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={promoTriggerRef} className="h-px" />

        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((product) => {
              const FallbackIcon = product.fallbackIcon ?? CupSoda;
              const selectedPasta = pastaChoice[product.id] ?? PASTA_TYPES[0];
              const selectedFlavor = jugoFlavor[product.id] ?? JUGO_FLAVORS[0].name;
              const selectedMilk = jugoMilk[product.id] ?? MILK_OPTIONS[0];
              const selectedVariant = product.pastaChoice
                ? selectedPasta
                : product.jugoCombo
                  ? `${selectedFlavor}${JUGO_VARIANT_SEP}${selectedMilk}`
                  : undefined;
              const unitPrice = getUnitPrice(product, selectedVariant);
              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                >
                  <div className="overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        width={1024}
                        height={1024}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-primary/15 to-basil/15">
                        <FallbackIcon className="size-16 text-primary/70" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-xl">{product.name}</h3>
                    </div>
                    {product.tag && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {product.tag}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground">{product.description}</p>

                    {product.pastaChoice && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PASTA_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setPastaChoice((prev) => ({ ...prev, [product.id]: type }))
                            }
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                              selectedPasta === type
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-transparent text-muted-foreground hover:bg-accent"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}

                    {product.jugoCombo && (
                      <>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {JUGO_FLAVORS.map((flavor) => (
                            <button
                              key={flavor.name}
                              type="button"
                              onClick={() =>
                                setJugoFlavor((prev) => ({ ...prev, [product.id]: flavor.name }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                selectedFlavor === flavor.name
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-transparent text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {flavor.name}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {MILK_OPTIONS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setJugoMilk((prev) => ({ ...prev, [product.id]: option }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                selectedMilk === option
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-transparent text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-display text-2xl text-primary">
                        {formatCOP(unitPrice)}
                      </span>
                      <button
                        onClick={() => addToCart(product.id, selectedVariant)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-basil px-4 py-2 text-sm font-semibold text-basil-foreground transition-transform hover:scale-[1.04] active:scale-95"
                      >
                        <Plus className="size-4" aria-hidden />
                        Agregar
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="border-y border-border bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Nuestra historia
            </p>
            <h2 className="text-4xl">Más que pasta</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Somos un negocio familiar de comida italiana en Palmira. Preparamos cada
              plato del día: pasta a tu gusto, sánduches, hamburguesa y
              churrasco, listos para disfrutar en casa.
            </p>
            <ul className="mt-6 space-y-2 text-foreground">
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-basil" />
                Preparado cada día
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-basil" />
                Ingredientes frescos y de calidad
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-basil" />
                Domicilios a toda Palmira, de {HOURS}
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <img
              src={localImg}
              alt="Local Fidelio en Palmira"
              width={1920}
              height={1080}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-4xl">Contacto y domicilios</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6">
            <MapPin className="size-6 text-primary" aria-hidden />
            <p className="font-semibold">Dirección</p>
            <p className="text-sm text-muted-foreground">{ADDRESS}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6">
            <Bike className="size-6 text-primary" aria-hidden />
            <p className="font-semibold">Domicilios</p>
            <p className="text-sm text-muted-foreground">A toda Palmira</p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6">
            <Clock className="size-6 text-primary" aria-hidden />
            <p className="font-semibold">Horario</p>
            <p className="text-sm text-muted-foreground">{HOURS}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 transition-colors hover:bg-accent"
          >
            <MessageCircle className="size-6 text-primary" aria-hidden />
            <p className="font-semibold">Pedidos</p>
            <p className="text-sm text-muted-foreground">WhatsApp {WHATSAPP_DISPLAY}</p>
          </a>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <Instagram className="size-5" aria-hidden />
          @fideliopasta
        </a>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logoImg} alt="Fidelio — Más que pasta" className="h-10 w-auto" />
          <p className="text-sm text-muted-foreground">
            {ADDRESS} · Domicilios a toda Palmira · {HOURS}
          </p>
        </div>
      </footer>

      {/* Anuncio promocional */}
      <AnimatePresence>
        {promoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPromoOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border shadow-2xl sm:max-w-md"
            >
              <button
                onClick={() => setPromoOpen(false)}
                aria-label="Cerrar anuncio"
                className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-transform hover:scale-105"
              >
                <X className="size-5" aria-hidden />
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setPromoOpen(false)}
              >
                <img
                  src={promoImg}
                  alt="Mientras uno esté vivo, uno debe comer pasta lo más que pueda — Fidelio"
                  className="block w-full"
                />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carrito */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="text-2xl">Tu carrito</h3>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Cerrar carrito"
                  className="rounded-full p-2 transition-colors hover:bg-accent"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                  <ShoppingBasket className="size-10" aria-hidden />
                  <p>Tu carrito está vacío.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground"
                  >
                    Ver el menú
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-4 overflow-y-auto p-5">
                    {cartItems.map(({ key, product, variant, qty }) => {
                      const FallbackIcon = product.fallbackIcon ?? CupSoda;
                      const unitPrice = getUnitPrice(product, variant);
                      return (
                        <div key={key} className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              width={1024}
                              height={1024}
                              loading="lazy"
                              className="size-16 shrink-0 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-basil/15">
                              <FallbackIcon className="size-6 text-primary/70" aria-hidden />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{cartLabel(product, variant)}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCOP(unitPrice)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => removeFromCart(key)}
                              aria-label={`Quitar un ${product.name}`}
                              className="rounded-full border border-border p-1.5 transition-colors hover:bg-accent"
                            >
                              <Minus className="size-3.5" aria-hidden />
                            </button>
                            <span className="w-6 text-center font-semibold">{qty}</span>
                            <button
                              onClick={() => addToCart(product.id, variant)}
                              aria-label={`Agregar un ${product.name}`}
                              className="rounded-full border border-border p-1.5 transition-colors hover:bg-accent"
                            >
                              <Plus className="size-3.5" aria-hidden />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-border p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-display text-3xl">{formatCOP(total)}</span>
                    </div>
                    <button
                      onClick={orderOnWhatsApp}
                      className="w-full rounded-full bg-basil py-3.5 font-semibold text-basil-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Pedir por WhatsApp
                    </button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Te confirmamos disponibilidad y domicilio por chat.
                    </p>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
