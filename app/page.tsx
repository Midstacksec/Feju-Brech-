"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

const categories = ["Todos", "Regatas", "Blusas", "Cardigans", "Casaquinhos", "Camisetas"];

const products = [
  {
    id: 1,
    name: "Regatinha básica",
    category: "Regatas",
    size: "G",
    price: 22,
    tag: "básica",
    image: "/products/regatinha-basica-g.png",
    imagePosition: "center 48%",
    status: "Disponível",
    description: "Regatinha básica em tom rosa claro, leve e fácil de combinar.",
    measurements: "Busto 92 cm · Comprimento 57 cm",
  },
  {
    id: 2,
    name: "Cardigan preto básico",
    category: "Cardigans",
    size: "G",
    price: 30,
    tag: "básico",
    image: "/products/cardigan-preto-g.png",
    imagePosition: "center 42%",
    status: "Disponível",
    description: "Cardigan preto básico, curinga para sobreposição e meia-estação.",
    measurements: "Busto 98 cm · Comprimento 54 cm · Manga 56 cm",
  },
  {
    id: 3,
    name: "Casaquinho animal print",
    category: "Casaquinhos",
    size: "44",
    price: 30,
    tag: "animal print",
    image: "/products/casaquinho-animal-print-44.png",
    imagePosition: "center 40%",
    status: "Disponível",
    description: "Casaquinho animal print com presença, para looks retrô e místicos.",
    measurements: "Busto 106 cm · Comprimento 58 cm · Manga 57 cm",
  },
  {
    id: 4,
    name: "Regata estampada",
    category: "Regatas",
    size: "GG",
    price: 20,
    tag: "estampada",
    image: "/products/regata-estampada-gg.png",
    imagePosition: "center 42%",
    status: "Disponível",
    description: "Regata estampada em preto, branco e roxo, com amarração frontal.",
    measurements: "Busto 108 cm · Comprimento 61 cm",
  },
  {
    id: 5,
    name: "Camiseta de bolinhas",
    category: "Camisetas",
    size: "G",
    price: 20,
    tag: "poá",
    image: "/products/camiseta-bolinhas-g.png",
    imagePosition: "center 43%",
    status: "Disponível",
    description: "Camiseta preta de bolinhas, confortável e fácil de usar no dia a dia.",
    measurements: "Busto 98 cm · Comprimento 60 cm",
  },
  {
    id: 6,
    name: "Regata bordô",
    category: "Regatas",
    size: "GG",
    price: 20,
    tag: "bordô",
    image: "/products/regata-bordo-gg.png",
    imagePosition: "center 42%",
    status: "Disponível",
    description: "Regata bordô de alça larga, peça básica com cor intensa.",
    measurements: "Busto 106 cm · Comprimento 59 cm",
  },
  {
    id: 7,
    name: "Blusa manga longa azul com lacinho",
    category: "Blusas",
    size: "G2",
    price: 25,
    tag: "lacinho",
    image: "/products/blusa-azul-lacinho-g2.png",
    imagePosition: "center 43%",
    status: "Disponível",
    description: "Blusa azul canelada de manga longa, com lacinho e detalhe vermelho.",
    measurements: "Busto 104 cm · Comprimento 62 cm · Manga 58 cm",
  },
];

const instagramUrl = "https://www.instagram.com/brecho.feju/";
const storeEmail = "brechofeju@gmail.com";

type CepAddress = {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  region: string;
  shipping: number;
  freeShippingFrom: number;
};

type Customer = {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  password: string;
};

type Order = {
  id: string;
  customerId: string;
  createdAt: string;
  status: string;
  total: number;
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

const emptyCustomerForm = {
  fullName: "",
  email: "",
  cpf: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  password: "",
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [cart, setCart] = useState<number[]>([]);
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [accountMode, setAccountMode] = useState<"register" | "login" | "orders">("register");
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [accountMessage, setAccountMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mercado Pago");
  const [activeSize, setActiveSize] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(40);
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedCustomer = window.localStorage.getItem("feju-current-customer");
    const savedOrders = window.localStorage.getItem("feju-orders");

    if (savedCustomer) {
      setCurrentCustomer(JSON.parse(savedCustomer));
      setAccountMode("orders");
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedWishlist = window.localStorage.getItem("feju-wishlist");

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    const savedTheme = window.localStorage.getItem("feju-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("feju-theme", theme);
  }, [theme]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesSize = activeSize === "Todos" || product.size === activeSize;
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesSize && matchesPrice;
    });
  }, [activeCategory, activeSize, maxPrice]);

  const availableSizes = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.size)))],
    [],
  );

  const cartTotal = cart.reduce((total, productId) => {
    const product = products.find((item) => item.id === productId);
    return total + (product?.price ?? 0);
  }, 0);

  const cartLineItems = products
    .map((product) => ({
      ...product,
      quantity: cart.filter((productId) => productId === product.id).length,
    }))
    .filter((product) => product.quantity > 0);

  const shippingCost = cartTotal >= 299 ? 0 : address?.shipping ?? 0;
  const orderTotal = cartTotal + shippingCost;
  const customerOrders = orders.filter((order) => order.customerId === currentCustomer?.id);
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));
  const orderEmailSubject = encodeURIComponent("Atendimento Feju - sacola");
  const orderEmailBody = encodeURIComponent(
    `Oi, Feju! Quero atendimento sobre minha sacola:\n${cartLineItems
      .map((item) => `${item.quantity}x ${item.name} - ${formatPrice(item.price)}`)
      .join("\n")}\nTotal: ${formatPrice(orderTotal)}`,
  );

  function buildProductEmailHref(product: (typeof products)[number]) {
    const subject = encodeURIComponent(`Dúvida sobre ${product.name}`);
    const body = encodeURIComponent(
      `Oi, Feju! Quero saber mais sobre esta peça:\n${product.name}\nTamanho ${product.size}\n${formatPrice(
        product.price,
      )}`,
    );

    return `mailto:${storeEmail}?subject=${subject}&body=${body}`;
  }

  async function searchCep() {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setCheckoutMessage("Digite um CEP com 8 números.");
      return;
    }

    setIsLoadingCep(true);
    setCheckoutMessage("");

    try {
      const response = await fetch(`/api/cep/${cleanCep}`);
      const data = await response.json();

      if (!response.ok) {
        setAddress(null);
        setCheckoutMessage(data.message ?? "Não foi possível consultar o CEP.");
        return;
      }

      setAddress(data);
    } catch {
      setAddress(null);
      setCheckoutMessage("Não foi possível consultar o CEP agora.");
    } finally {
      setIsLoadingCep(false);
    }
  }

  async function startCheckout() {
    if (!cart.length) {
      setCheckoutMessage("Escolha pelo menos um achado para finalizar.");
      return;
    }

    if (!currentCustomer) {
      setCheckoutMessage("Crie sua conta ou faça login antes de finalizar a compra.");
      setAccountMode("register");
      document.getElementById("conta")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsCheckingOut(true);
    setCheckoutMessage("");

    const items = cart.map((productId) => {
      const product = products.find((item) => item.id === productId)!;

      return {
        id: product.id,
        title: product.name,
        quantity: 1,
        unit_price: product.price,
      };
    });

    const order: Order = {
      id: `FEJU-${Date.now()}`,
      customerId: currentCustomer.id,
      createdAt: new Date().toISOString(),
      status: "Pagamento iniciado",
      total: orderTotal,
      paymentMethod,
      items: cartLineItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    window.localStorage.setItem("feju-orders", JSON.stringify(nextOrders));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          cep: address?.cep,
          shippingCost,
          paymentMethod,
          customer: currentCustomer,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setCheckoutMessage(data.message ?? "Não foi possível iniciar o pagamento.");
        return;
      }

      window.location.href = data.initPoint ?? data.sandboxInitPoint;
    } catch {
      setCheckoutMessage("Não foi possível iniciar o pagamento agora.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  function removeFromCart(productId: number) {
    setCart((items) => {
      const index = items.indexOf(productId);

      if (index < 0) return items;

      return [...items.slice(0, index), ...items.slice(index + 1)];
    });
  }

  function updateCustomerField(field: keyof typeof emptyCustomerForm, value: string) {
    setCustomerForm((form) => ({ ...form, [field]: value }));
  }

  async function fillAddressFromCustomerCep() {
    const cleanCep = customerForm.cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setAccountMessage("Digite um CEP com 8 números para completar o endereço.");
      return;
    }

    try {
      const response = await fetch(`/api/cep/${cleanCep}`);
      const data = await response.json();

      if (!response.ok) {
        setAccountMessage(data.message ?? "Não foi possível consultar o CEP.");
        return;
      }

      setCustomerForm((form) => ({
        ...form,
        street: data.street ?? "",
        neighborhood: data.neighborhood ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
      }));
      setAccountMessage("Endereço preenchido pelo CEP. Confira o número.");
    } catch {
      setAccountMessage("Não foi possível consultar o CEP agora.");
    }
  }

  function registerCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredFields = [
      customerForm.fullName,
      customerForm.email,
      customerForm.cpf,
      customerForm.phone,
      customerForm.cep,
      customerForm.street,
      customerForm.number,
      customerForm.neighborhood,
      customerForm.city,
      customerForm.state,
      customerForm.password,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setAccountMessage("Preencha os dados obrigatórios para criar sua conta.");
      return;
    }

    const savedCustomers = JSON.parse(window.localStorage.getItem("feju-customers") ?? "[]") as Customer[];
    const emailAlreadyExists = savedCustomers.some(
      (customer) => customer.email.toLowerCase() === customerForm.email.toLowerCase(),
    );

    if (emailAlreadyExists) {
      setAccountMessage("Já existe uma conta com esse e-mail. Faça login.");
      setAccountMode("login");
      return;
    }

    const customer: Customer = {
      id: `cliente-${Date.now()}`,
      ...customerForm,
    };

    const nextCustomers = [...savedCustomers, customer];
    window.localStorage.setItem("feju-customers", JSON.stringify(nextCustomers));
    window.localStorage.setItem("feju-current-customer", JSON.stringify(customer));
    setCurrentCustomer(customer);
    setAccountMode("orders");
    setAccountMessage("Conta criada. Agora você pode finalizar suas compras.");
  }

  function loginCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedCustomers = JSON.parse(window.localStorage.getItem("feju-customers") ?? "[]") as Customer[];
    const customer = savedCustomers.find(
      (item) =>
        item.email.toLowerCase() === loginForm.email.toLowerCase() && item.password === loginForm.password,
    );

    if (!customer) {
      setAccountMessage("E-mail ou senha não encontrados.");
      return;
    }

    window.localStorage.setItem("feju-current-customer", JSON.stringify(customer));
    setCurrentCustomer(customer);
    setAccountMode("orders");
    setAccountMessage("Login feito. Sua conta está pronta para comprar.");
  }

  function logoutCustomer() {
    window.localStorage.removeItem("feju-current-customer");
    setCurrentCustomer(null);
    setAccountMode("login");
    setAccountMessage("Você saiu da conta.");
  }

  function toggleWishlist(productId: number) {
    setWishlist((items) => {
      const nextItems = items.includes(productId)
        ? items.filter((item) => item !== productId)
        : [...items, productId];

      window.localStorage.setItem("feju-wishlist", JSON.stringify(nextItems));
      return nextItems;
    });
  }

  function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!leadEmail.trim()) {
      setLeadMessage("Digite seu e-mail para receber avisos.");
      return;
    }

    const savedLeads = JSON.parse(window.localStorage.getItem("feju-leads") ?? "[]") as string[];
    const nextLeads = Array.from(new Set([...savedLeads, leadEmail.trim().toLowerCase()]));
    window.localStorage.setItem("feju-leads", JSON.stringify(nextLeads));
    setLeadEmail("");
    setLeadMessage("Pronto. Você entrou na lista de avisos de garimpo.");
  }

  return (
    <main>
      <div className="topbar">
        <span>Drop aberto · peças únicas · envio para todo o Brasil</span>
        <a href={instagramUrl} target="_blank">acompanhe no Instagram</a>
      </div>

      <div className="cosmic-sky" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <i className="shooting-star shooting-star-left" />
        <i className="shooting-star shooting-star-right" />
        <i className="shooting-star shooting-star-left shooting-star-delay" />
        <i className="shooting-star shooting-star-right shooting-star-delay" />
        <b className="side-star side-star-left">✦</b>
        <b className="side-star side-star-right">✦</b>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Feju peças únicas">
          <Image src="/feju-logo.png" alt="Feju peças únicas" width={76} height={76} priority />
          <span>
            <strong>feju</strong>
            <small>peças únicas</small>
          </span>
        </a>
        <nav aria-label="Principal">
          <a href="#garimpo">Garimpo</a>
          <a href="#envio">Envio</a>
          <a href="#ritual">Ritual</a>
          <a href="#conta">Conta</a>
          <a href={instagramUrl} target="_blank">Instagram</a>
        </nav>
        <a className="cart-pill" href="#sacola">
          Sacola <span>{cart.length}</span>
        </a>
        <button
          className="theme-toggle"
          aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
          type="button"
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-orb">{theme === "dark" ? "☾" : "☀"}</span>
          </span>
          <span className="theme-toggle-label">{theme === "dark" ? "Noite" : "Dia"}</span>
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">brechó online · curadoria afetiva</p>
          <h1>Peças únicas com alma vintage e presença de ritual.</h1>
          <p>
            Garimpos boho, retrô e místicos escolhidos um a um, com medidas reais,
            atendimento pelo Instagram e envio para qualquer canto do Brasil.
          </p>
          <div className="hero-actions">
            <a href="#garimpo">Explorar garimpo</a>
            <a href="#envio">Calcular frete</a>
          </div>
          <div className="hero-notes" aria-label="Diferenciais do brechó">
            <span>peça única</span>
            <span>curadoria real</span>
            <span>envio nacional</span>
          </div>
        </div>

        <div className="hero-board" aria-label="Composição visual boho retrô">
          <Image src="/products/blusa-azul-lacinho-g2.png" alt="" width={280} height={380} className="hero-product hero-product-main" />
          <Image src="/products/casaquinho-animal-print-44.png" alt="" width={210} height={280} className="hero-product hero-product-side" />
          <Image src="/feju-logo.png" alt="" width={142} height={142} className="logo-card" />
          <div className="paper paper-rose">garimpo</div>
          <div className="paper paper-olive">boho</div>
          <div className="moon" />
          <div className="star star-one">✦</div>
          <div className="star star-two">✧</div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Informações rápidas">
        <span>Peças únicas selecionadas</span>
        <span>Fotos e medidas conferidas</span>
        <span>Atendimento por Instagram e e-mail</span>
        <span>Pagamento seguro via Mercado Pago</span>
      </section>

      <section className="shop" id="garimpo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">garimpo aberto</p>
            <h2>Achados da semana</h2>
          </div>
          <p>
            Cada item aparece uma vez. Gostou, colocou na sacola, garantiu o encanto.
          </p>
        </div>

        <div className="category-bar" aria-label="Categorias">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="shop-filters" aria-label="Filtros de garimpo">
          <label>
            Tamanho
            <select value={activeSize} onChange={(event) => setActiveSize(event.target.value)}>
              {availableSizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <label>
            Até {formatPrice(maxPrice)}
            <input
              min={20}
              max={40}
              step={5}
              type="range"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-art photo">
                <Image
                  alt={product.name}
                  className="product-photo"
                  fill
                  sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
                  src={product.image}
                  style={{ objectPosition: product.imagePosition }}
                />
                <span>{product.tag}</span>
                <em>{product.status}</em>
                <button
                  aria-label={wishlist.includes(product.id) ? "Remover dos favoritos" : "Favoritar peça"}
                  className={`wish-button ${wishlist.includes(product.id) ? "active" : ""}`}
                  onClick={() => toggleWishlist(product.id)}
                  type="button"
                >
                  ✦
                </button>
              </div>
              <div className="product-info">
                <div>
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                </div>
                <strong>{formatPrice(product.price)}</strong>
              </div>
              <div className="product-actions">
                <span>Tamanho {product.size}</span>
                <button className="ghost-button" type="button" onClick={() => setSelectedProduct(product)}>
                  Detalhes
                </button>
                <a
                  className="ghost-link"
                  href={buildProductEmailHref(product)}
                >
                  Perguntar
                </a>
                <button type="button" onClick={() => setCart((items) => [...items, product.id])}>
                  Adicionar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story" id="ritual">
        <div>
          <p className="eyebrow">curadoria</p>
          <h2>O ritual Feju antes da sua peça chegar.</h2>
        </div>
        <div className="ritual-list">
          <span>garimpo afetivo</span>
          <span>higienização cuidadosa</span>
          <span>medidas reais</span>
          <span>embalagem com encanto</span>
        </div>
      </section>

      <section className="about" id="sobre">
        <div>
          <p className="eyebrow">sobre a Feju</p>
          <h2>Brechó feito para roupa encontrar história nova.</h2>
        </div>
        <p>
          A Feju garimpa peças únicas com cuidado, carinho e olho atento para detalhes.
          Antes do envio, confirmamos medidas, estado da peça e qualquer observação importante,
          porque brechó bom também é compra transparente.
        </p>
      </section>

      <section className="shipping" id="envio">
        <div>
          <p className="eyebrow">do nosso altar para sua casa</p>
          <h2>Enviamos para todo o Brasil.</h2>
          <p>
            Consulte seu CEP, veja uma estimativa de frete e finalize com Pix ou cartão.
            Antes do envio, confirmamos medidas e detalhes para o achado chegar certo.
          </p>
        </div>
        <form className="shipping-box" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="cep">Consultar frete</label>
          <div>
            <input
              id="cep"
              inputMode="numeric"
              maxLength={9}
              onChange={(event) => setCep(event.target.value)}
              placeholder="Seu CEP"
              value={cep}
            />
            <button disabled={isLoadingCep} onClick={searchCep} type="button">
              {isLoadingCep ? "Consultando" : "Calcular"}
            </button>
          </div>
          {address ? (
            <p className="address-result">
              {address.city}/{address.state} · {cartTotal >= 299 ? "frete grátis" : formatPrice(address.shipping)}
            </p>
          ) : null}
          <small>Frete grátis em compras acima de R$ 299.</small>
        </form>
      </section>

      <section className="wishlist-section" id="favoritos">
        <div>
          <p className="eyebrow">favoritos</p>
          <h2>Suas peças guardadas</h2>
          <p>
            Favorite os achados enquanto decide. Como cada peça é única, favorito não reserva,
            mas ajuda você a voltar nela rapidinho.
          </p>
        </div>
        <div className="wishlist-list">
          {wishlistProducts.length ? (
            wishlistProducts.map((product) => (
              <article key={product.id}>
                <Image alt={product.name} src={product.image} width={82} height={82} />
                <div>
                  <strong>{product.name}</strong>
                  <span>
                    Tamanho {product.size} · {formatPrice(product.price)}
                  </span>
                </div>
                <button type="button" onClick={() => setCart((items) => [...items, product.id])}>
                  Adicionar
                </button>
              </article>
            ))
          ) : (
            <p>Nenhuma peça favoritada ainda.</p>
          )}
        </div>
      </section>

      <section className="account" id="conta">
        <div className="section-heading">
          <div>
            <p className="eyebrow">minha conta</p>
            <h2>Entre, compre e acompanhe seus pedidos.</h2>
          </div>
          <p>
            Cadastre seus dados uma vez para finalizar compras com Pix, cartão, boleto e saldo
            pelo Mercado Pago.
          </p>
        </div>

        <div className="account-shell">
          <div className="account-tabs" aria-label="Área da cliente">
            <button
              className={accountMode === "register" ? "active" : ""}
              onClick={() => setAccountMode("register")}
              type="button"
            >
              Criar conta
            </button>
            <button
              className={accountMode === "login" ? "active" : ""}
              onClick={() => setAccountMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={accountMode === "orders" ? "active" : ""}
              onClick={() => setAccountMode("orders")}
              type="button"
            >
              Pedidos
            </button>
          </div>

          {accountMode === "register" ? (
            <form className="account-form" onSubmit={registerCustomer}>
              <label>
                Nome completo*
                <input
                  value={customerForm.fullName}
                  onChange={(event) => updateCustomerField("fullName", event.target.value)}
                />
              </label>
              <label>
                E-mail*
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(event) => updateCustomerField("email", event.target.value)}
                />
              </label>
              <label>
                CPF*
                <input
                  inputMode="numeric"
                  value={customerForm.cpf}
                  onChange={(event) => updateCustomerField("cpf", event.target.value)}
                />
              </label>
              <label>
                Telefone para entrega*
                <input
                  inputMode="tel"
                  value={customerForm.phone}
                  onChange={(event) => updateCustomerField("phone", event.target.value)}
                />
              </label>
              <label>
                CEP*
                <span className="inline-field">
                  <input
                    inputMode="numeric"
                    value={customerForm.cep}
                    onChange={(event) => updateCustomerField("cep", event.target.value)}
                  />
                  <button onClick={fillAddressFromCustomerCep} type="button">
                    Buscar
                  </button>
                </span>
              </label>
              <label>
                Rua*
                <input
                  value={customerForm.street}
                  onChange={(event) => updateCustomerField("street", event.target.value)}
                />
              </label>
              <label>
                Número*
                <input
                  value={customerForm.number}
                  onChange={(event) => updateCustomerField("number", event.target.value)}
                />
              </label>
              <label>
                Complemento
                <input
                  value={customerForm.complement}
                  onChange={(event) => updateCustomerField("complement", event.target.value)}
                />
              </label>
              <label>
                Bairro*
                <input
                  value={customerForm.neighborhood}
                  onChange={(event) => updateCustomerField("neighborhood", event.target.value)}
                />
              </label>
              <label>
                Cidade*
                <input
                  value={customerForm.city}
                  onChange={(event) => updateCustomerField("city", event.target.value)}
                />
              </label>
              <label>
                Estado*
                <input
                  maxLength={2}
                  value={customerForm.state}
                  onChange={(event) => updateCustomerField("state", event.target.value.toUpperCase())}
                />
              </label>
              <label>
                Senha*
                <input
                  type="password"
                  value={customerForm.password}
                  onChange={(event) => updateCustomerField("password", event.target.value)}
                />
              </label>
              <button type="submit">Criar minha conta</button>
            </form>
          ) : null}

          {accountMode === "login" ? (
            <form className="account-form compact" onSubmit={loginCustomer}>
              <label>
                E-mail
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((form) => ({ ...form, email: event.target.value }))}
                />
              </label>
              <label>
                Senha
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((form) => ({ ...form, password: event.target.value }))}
                />
              </label>
              <button type="submit">Entrar</button>
            </form>
          ) : null}

          {accountMode === "orders" ? (
            <div className="orders-panel">
              {currentCustomer ? (
                <div className="customer-card">
                  <strong>{currentCustomer.fullName}</strong>
                  <span>{currentCustomer.email}</span>
                  <span>
                    {currentCustomer.city}/{currentCustomer.state} · CEP {currentCustomer.cep}
                  </span>
                  <button onClick={logoutCustomer} type="button">
                    Sair
                  </button>
                </div>
              ) : (
                <p className="empty-orders">Faça login ou crie sua conta para ver seus pedidos.</p>
              )}

              <div className="orders-list">
                {customerOrders.length ? (
                  customerOrders.map((order) => (
                    <article className="order-card" key={order.id}>
                      <div>
                        <strong>{order.id}</strong>
                        <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <p>{order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</p>
                      <span>{order.status}</span>
                      <b>{formatPrice(order.total)}</b>
                    </article>
                  ))
                ) : (
                  <p className="empty-orders">Nenhum pedido por enquanto.</p>
                )}
              </div>
            </div>
          ) : null}

          {accountMessage ? <p className="account-message">{accountMessage}</p> : null}
        </div>
      </section>

      <section className="garimpo-alert">
        <div>
          <p className="eyebrow">aviso de garimpo</p>
          <h2>Receba novidades antes de sumirem.</h2>
          <p>
            Entre na lista para saber quando chegarem novas peças, reposições de tamanhos e
            drops especiais da Feju.
          </p>
        </div>
        <form onSubmit={saveLead}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={leadEmail}
            onChange={(event) => setLeadEmail(event.target.value)}
          />
          <button type="submit">Quero receber</button>
          {leadMessage ? <small>{leadMessage}</small> : null}
        </form>
      </section>

      <section className="policies" id="politicas">
        <div className="section-heading">
          <div>
            <p className="eyebrow">informações importantes</p>
            <h2>Políticas do brechó</h2>
          </div>
          <p>Essas regras deixam a compra clara antes da peça sair daqui.</p>
        </div>
        <div className="policy-grid">
          <article>
            <h3>Trocas e devoluções</h3>
            <p>
              Por serem peças únicas de brechó, conferimos medidas, fotos e estado antes do envio.
              Caso exista algum problema não informado, fale com a Feju em até 7 dias após o recebimento.
            </p>
          </article>
          <article>
            <h3>Peças únicas</h3>
            <p>
              Cada achado tem apenas uma unidade. Quando a compra é confirmada, a peça sai do catálogo
              e fica reservada para a cliente.
            </p>
          </article>
          <article>
            <h3>Privacidade</h3>
            <p>
              Nome, CPF, e-mail, telefone e endereço são usados apenas para compra, envio, atendimento
              e emissão/controle do pedido. Não vendemos dados de clientes.
            </p>
          </article>
          <article>
            <h3>Envio</h3>
            <p>
              Enviamos para todo o Brasil. O prazo e o valor dependem do CEP. O código de rastreio é
              enviado após a postagem.
            </p>
          </article>
        </div>
      </section>

      <section className="faq" id="duvidas">
        <div className="section-heading">
          <div>
            <p className="eyebrow">dúvidas rápidas</p>
            <h2>Perguntas frequentes</h2>
          </div>
        </div>
        <div className="faq-grid">
          <details>
            <summary>Favoritar reserva a peça?</summary>
            <p>Não. Como é brechó, a peça só fica reservada depois da confirmação da compra.</p>
          </details>
          <details>
            <summary>Vocês confirmam medidas?</summary>
            <p>Sim. Antes do envio, a Feju pode confirmar medidas, estado da peça e detalhes por Instagram ou e-mail.</p>
          </details>
          <details>
            <summary>Quais pagamentos aceitam?</summary>
            <p>Pix, cartão, boleto e saldo Mercado Pago, conforme disponibilidade do checkout Mercado Pago.</p>
          </details>
          <details>
            <summary>Envia para todo o Brasil?</summary>
            <p>Sim. O frete é calculado pelo CEP e o rastreio é enviado após a postagem.</p>
          </details>
        </div>
      </section>

      <aside className="bag" id="sacola" aria-label="Resumo da sacola">
        <div>
          <p className="eyebrow">sacola</p>
          <h2>
            {cart.length
              ? `${cart.length} ${cart.length === 1 ? "item" : "itens"}`
              : "Sua sacola espera um achado"}
          </h2>
        </div>
        {cartLineItems.length ? (
          <div className="bag-items">
            {cartLineItems.map((item) => (
              <div className="bag-item" key={item.id}>
                <span>
                  {item.quantity}x {item.name}
                </span>
                <button type="button" onClick={() => removeFromCart(item.id)}>
                  remover
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <div className="bag-total">
          <p>Produtos: <strong>{formatPrice(cartTotal)}</strong></p>
          <p>Frete: <strong>{address ? formatPrice(shippingCost) : "calcule pelo CEP"}</strong></p>
          <p>Total: <strong>{formatPrice(orderTotal)}</strong></p>
          <label className="payment-select">
            Forma de pagamento
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option>Mercado Pago</option>
              <option>Pix</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
              <option>Boleto</option>
              <option>Saldo Mercado Pago</option>
            </select>
          </label>
          {checkoutMessage ? <small>{checkoutMessage}</small> : null}
        </div>
        <div className="bag-actions">
          <button className="primary-action" disabled={isCheckingOut} onClick={startCheckout} type="button">
            {isCheckingOut ? "Abrindo pagamento" : "Pagar com Pix ou cartão"}
          </button>
          <a
            className="secondary-action"
            href={`mailto:${storeEmail}?subject=${orderEmailSubject}&body=${orderEmailBody}`}
          >
            Tirar dúvida por e-mail
          </a>
          <a className="social-action" href={instagramUrl} target="_blank">
            Chamar no Instagram
          </a>
        </div>
      </aside>

      <footer className="site-footer">
        <div>
          <Image src="/feju-logo.png" alt="Feju peças únicas" width={70} height={70} />
          <p>Feju Peças Únicas · brechó online com envio para todo o Brasil.</p>
        </div>
        <nav aria-label="Rodapé">
          <a href="#sobre">Sobre</a>
          <a href="#politicas">Políticas</a>
          <a href="#duvidas">Dúvidas</a>
          <a href="#conta">Minha conta</a>
          <a href={instagramUrl} target="_blank">Instagram</a>
          <a href={`mailto:${storeEmail}`}>{storeEmail}</a>
        </nav>
      </footer>

      {selectedProduct ? (
        <div className="product-modal" role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
          <div className="product-modal-card">
            <button className="modal-close" onClick={() => setSelectedProduct(null)} type="button">
              Fechar
            </button>
            <div className="modal-photo">
              <Image
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 700px) 100vw, 45vw"
                src={selectedProduct.image}
                style={{ objectPosition: selectedProduct.imagePosition }}
              />
            </div>
            <div className="modal-copy">
              <p className="eyebrow">{selectedProduct.status}</p>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <dl>
                <div>
                  <dt>Tamanho</dt>
                  <dd>{selectedProduct.size}</dd>
                </div>
                <div>
                  <dt>Medidas</dt>
                  <dd>{selectedProduct.measurements}</dd>
                </div>
                <div>
                  <dt>Valor</dt>
                  <dd>{formatPrice(selectedProduct.price)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => {
                  setCart((items) => [...items, selectedProduct.id]);
                  setSelectedProduct(null);
                }}
              >
                Adicionar à sacola
              </button>
              <a
                className="modal-contact"
                href={buildProductEmailHref(selectedProduct)}
              >
                Perguntar por e-mail
              </a>
              <a className="modal-instagram" href={instagramUrl} target="_blank">
                Ver Instagram da Feju
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
