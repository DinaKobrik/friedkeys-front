"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/Sections/Game/CartHandler";
import Pagination from "@/components/ui/Pagination";
import PaymentMethod from "./PaymentMethod";

interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  discount?: number;
  discountDate?: string;
  isFavorite?: boolean;
}

interface CartItem {
  quantity: number;
  edition: string;
  platform: string;
  region: string;
  addedAt: number;
}

// Хук для управления скроллом и границами
function useScrollBorders(cartQuantities: Record<string, CartItem>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollBorders, setScrollBorders] = useState({
    top: false,
    bottom: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        const totalHeight = Object.keys(cartQuantities).length * 60;
        const isScrolledToTop = scrollTop > 0;
        const isScrolledToBottom = scrollTop + clientHeight < scrollHeight - 1;

        setScrollBorders({
          top: isScrolledToTop,
          bottom: totalHeight > 254 && (isScrolledToBottom || scrollTop === 0),
        });
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [cartQuantities]);

  return { scrollContainerRef, scrollBorders };
}

const PaymentContent = () => {
  const { cartQuantities, setCartQuantities } = useCart();
  const [selectedAdress, setSelectedAdress] = useState("");
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isTouchedAddress, setIsTouchedAddress] = useState(false);
  const [isTouchedDiscountCode, setIsTouchedDiscountCode] = useState(false);
  const [isTouchedGiftCard, setIsTouchedGiftCard] = useState(false);
  const [isPayClicked, setIsPayClicked] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [giftCard, setGiftCard] = useState("");
  const [cartGames, setCartGames] = useState<Game[]>([]);
  const adressRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 5;
  const [editingCartKey, setEditingCartKey] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const paymentMethodRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<Record<string, CartItem>>({}); // eslint-disable-line @typescript-eslint/no-unused-vars
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [orderData, setOrderData] = useState<{
    total: number;
    date: string;
    time: string;
    paymentMethod: string;
  } | null>(null);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const [displayMode, setDisplayMode] = useState(2); // eslint-disable-line @typescript-eslint/no-unused-vars
  const addresses = [
    "France (VAT 20%)",
    "Germany (VAT 19%)",
    "United Kingdom (VAT 20%)",
    "Italy (VAT 22%)",
    "Spain (VAT 21%)",
    "Canada (GST 5%)",
    "Australia (GST 10%)",
    "Japan (VAT 10%)",
    "Brazil (VAT 17%)",
    "Netherlands (VAT 21%)",
    "Sweden (VAT 25%)",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adressRef.current &&
        !adressRef.current.contains(event.target as Node)
      ) {
        setIsAddressOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrder = localStorage.getItem("order");
      if (savedOrder) setOrder(JSON.parse(savedOrder));
      const savedOrderData = localStorage.getItem("orderData");
      if (savedOrderData) setOrderData(JSON.parse(savedOrderData));
    }
  }, []);

  const fetchGameById = async (id: number) => {
    try {
      const response = await fetch(`/api/games?type=game&id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch game");
      const data = await response.json();
      if (Array.isArray(data)) {
        const foundGame = data.find((g) => g.id === id);
        return foundGame || null;
      } else if (data.id) {
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch game with id ${id}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadCartGames = async () => {
      const gameIds = Object.keys(cartQuantities)
        .map((key) => Number(key.split("_")[0]))
        .filter((id, index, self) => self.indexOf(id) === index);
      if (gameIds.length > 0) {
        const gamesPromises = gameIds.map((id) => fetchGameById(id));
        const games = (await Promise.all(gamesPromises)).filter(
          (game) => game !== null
        ) as Game[];
        setCartGames(games);
      } else {
        setCartGames([]);
      }
    };
    loadCartGames();
  }, [cartQuantities]);

  const calculateItemTotal = (
    price: number,
    quantity: number,
    discount?: number
  ) => {
    if (discount) {
      const discountAmount = price * (discount / 100);
      return (price - discountAmount) * quantity;
    }
    return price * quantity;
  };

  const updateCartQuantity = useCallback(
    (cartKey: string, delta: number) => {
      const currentItem = cartQuantities[cartKey] || {
        quantity: 0,
        edition: "",
        platform: "",
        region: "",
        addedAt: Date.now(),
      };
      const newQuantity = Math.max(0, currentItem.quantity + delta);

      if (newQuantity === 0) {
        const newCartQuantities = { ...cartQuantities };
        delete newCartQuantities[cartKey];
        setCartQuantities(newCartQuantities);
      } else {
        const newItem = {
          ...currentItem,
          quantity: newQuantity,
          addedAt: Date.now(),
        };
        setCartQuantities({
          ...cartQuantities,
          [cartKey]: newItem,
        });
      }
    },
    [cartQuantities, setCartQuantities]
  );

  const calculateTotals = () => {
    let subtotal = 0;
    let vat = 0;
    let totalDiscount = 0;

    const vatPercentage = selectedAdress
      ? parseFloat(selectedAdress.match(/(\d+)%/)?.[1] || "0")
      : 0;

    Object.entries(cartQuantities).forEach(([cartKey, item]) => {
      const gameId = Number(cartKey.split("_")[0]);
      const game = cartGames.find((g) => g.id === gameId);
      if (game) {
        const currentDate = new Date();
        const discountDate = game.discountDate
          ? new Date(game.discountDate)
          : null;
        const isDiscountActive =
          game.discount && discountDate && discountDate > currentDate;

        const originalPrice = game.price;
        const itemTotal = calculateItemTotal(originalPrice, item.quantity);
        subtotal += itemTotal;

        if (isDiscountActive) {
          totalDiscount +=
            ((game.price * (game.discount || 0)) / 100) * item.quantity;
        }
      } else {
        console.warn(`Game with ID ${gameId} not found in cartGames`);
      }
    });

    vat = subtotal * (vatPercentage / 100);

    let promoDiscount = 0;
    const validPromoCodes = {
      SAVE10: 0.1,
      SAVE20: 0.2,
      SAVE25: 0.25,
    };
    const isValidPromoCode = discountCode in validPromoCodes;
    if (isValidPromoCode) {
      promoDiscount =
        subtotal *
        validPromoCodes[discountCode as keyof typeof validPromoCodes];
    }

    let giftCardDiscount = 0;
    const validGiftCards = {
      GIFT25: 25,
      GIFT50: 50,
      GIFT100: 100,
    };
    const isValidGiftCard = giftCard in validGiftCards;
    if (isValidGiftCard) {
      const discountValue =
        validGiftCards[giftCard as keyof typeof validGiftCards];
      giftCardDiscount =
        typeof discountValue === "number"
          ? discountValue
          : subtotal * discountValue;
      giftCardDiscount = Math.min(giftCardDiscount, subtotal);
    }

    const total = Math.max(
      0,
      subtotal + vat - totalDiscount - promoDiscount - giftCardDiscount
    );

    return {
      subtotal,
      vat,
      totalDiscount,
      promoDiscount,
      giftCardDiscount,
      total,
      vatPercentage,
      isValidPromoCode,
      isValidGiftCard,
    };
  };

  const {
    subtotal,
    vat,
    totalDiscount,
    promoDiscount,
    giftCardDiscount,
    total,
    vatPercentage,
    isValidPromoCode,
    isValidGiftCard,
  } = calculateTotals();

  const paginatedGames = useMemo(() => {
    const startIdx = (currentPage - 1) * gamesPerPage;
    const endIdx = currentPage * gamesPerPage;
    return Object.entries(cartQuantities)
      .slice(startIdx, endIdx)
      .map(([cartKey, item]) => {
        const gameId = Number(cartKey.split("_")[0]);
        const game = cartGames.find((g) => g.id === gameId);
        if (!game) return null;

        const currentDate = new Date();
        const discountDate = game.discountDate
          ? new Date(game.discountDate)
          : null;
        const isDiscountActive =
          game.discount && discountDate && discountDate > currentDate;
        const effectivePrice = isDiscountActive
          ? (game.price * (1 - (game.discount || 0) / 100)).toFixed(2)
          : game.price.toFixed(2);

        const handleQuantityChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const value = e.target.value.replace(/^0+/, "") || "";
          const numValue = value === "" ? 0 : parseInt(value) || 0;
          setNewQuantity(numValue);
        };

        const handleQuantityBlur = () => {
          setEditingCartKey(null);
          const finalQuantity = Math.max(1, newQuantity);
          if (finalQuantity !== item.quantity && editingCartKey === cartKey) {
            updateCartQuantity(cartKey, finalQuantity - item.quantity);
          }
          setNewQuantity(finalQuantity);
        };

        const displayTitle =
          item.edition === "Deluxe"
            ? `${game.title} Deluxe Edition`
            : game.title;

        return (
          <div
            key={cartKey}
            className="grid grid-cols-5 justify-between py-[8px] sm:py-[8px] items-center group">
            <div className="col-span-3 relative">
              <span className="text-white cursor-pointer text-[15px] leading-[15px] sm:leading-[18px] font-medium line-clamp-2 sm:line-clamp-1 hover:text-primary-main">
                {displayTitle}
              </span>
              <div className="absolute left-[10px] md:left-[32px] top-[30px] w-full bg-3 px-[12px] py-[12px] text-white text-[14px] leading-[14px] sm:text-[15px] sm:leading-[21px] hidden group-hover:block z-50">
                {item.edition === "Deluxe"
                  ? `${game.title} Deluxe Edition`
                  : game.title}
              </div>
            </div>
            <div className="flex items-center gap-[8px] justify-center">
              <button
                className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] flex items-center justify-center"
                onClick={() => updateCartQuantity(cartKey, -1)}>
                <svg
                  width="12"
                  height="2"
                  viewBox="0 0 17 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.5 1.00098H0.5"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <div
                className="relative max-w-[27px]"
                onClick={() => {
                  setEditingCartKey(cartKey);
                  setNewQuantity(item.quantity);
                }}>
                {editingCartKey === cartKey ? (
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    autoFocus
                    className="max-w-[22px] text-center text-[13px] bg-transparent text-primary-main no-arrows focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleQuantityBlur();
                    }}
                  />
                ) : (
                  <span className="text-white cursor-pointer max-w-[27px] text-[13px] text-center">
                    {item.quantity}
                  </span>
                )}
              </div>
              <button
                className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] flex items-center justify-center"
                onClick={() => updateCartQuantity(cartKey, 1)}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.5 12.001H4.5" stroke="white" strokeWidth="1.5" />
                  <path
                    d="M12.5 4.00098V20.001"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
            <span className="text-gray-68 font-bold text-[17px] leading-[17px] sm:leading-[21px] text-end">
              {effectivePrice}$
            </span>
          </div>
        );
      })
      .filter((item) => item !== null);
  }, [
    cartQuantities,
    cartGames,
    currentPage,
    gamesPerPage,
    updateCartQuantity,
    editingCartKey,
    newQuantity,
  ]);

  const { scrollContainerRef, scrollBorders } =
    useScrollBorders(cartQuantities);

  const scrolledGames = useMemo(() => {
    return (
      <div
        ref={scrollContainerRef}
        className={`flex flex-col w-full max-h-[258px] overflow-y-auto custom-scrollbar pr-[20px] ${
          scrollBorders.top ? "border-t-[2px] border-primary-main" : ""
        } ${scrollBorders.bottom ? "border-b-[2px] border-primary-main" : ""}`}>
        {Object.entries(cartQuantities)
          .map(([cartKey, item]) => {
            const gameId = Number(cartKey.split("_")[0]);
            const game = cartGames.find((g) => g.id === gameId);
            if (!game) return null;

            const currentDate = new Date();
            const discountDate = game.discountDate
              ? new Date(game.discountDate)
              : null;
            const isDiscountActive =
              game.discount && discountDate && discountDate > currentDate;
            const effectivePrice = isDiscountActive
              ? (game.price * (1 - (game.discount || 0) / 100)).toFixed(2)
              : game.price.toFixed(2);

            const handleQuantityChange = (
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              const value = e.target.value.replace(/^0+/, "") || "";
              const numValue = value === "" ? 0 : parseInt(value) || 0;
              setNewQuantity(numValue);
            };

            const handleQuantityBlur = () => {
              setEditingCartKey(null);
              const finalQuantity = Math.max(1, newQuantity);
              if (
                finalQuantity !== item.quantity &&
                editingCartKey === cartKey
              ) {
                updateCartQuantity(cartKey, finalQuantity - item.quantity);
              }
              setNewQuantity(finalQuantity);
            };

            const displayTitle =
              item.edition === "Deluxe"
                ? `${game.title} Deluxe Edition`
                : game.title;

            return (
              <div
                key={cartKey}
                className="grid grid-cols-4 xs:grid-cols-5 justify-between items-center py-[8px] sm:py-[8px] group gap-[8px]">
                <div className="col-span-2 xs:col-span-3 relative">
                  <span className="text-white cursor-pointer text-[15px] leading-[15px] sm:leading-[21px] font-medium line-clamp-2 sm:line-clamp-1 hover:text-primary-main">
                    {displayTitle}
                  </span>
                  <div className="absolute left-[10px] md:left-[32px] top-[30px] w-full bg-3 px-[12px] py-[12px] text-white text-[14px] leading-[14px] sm:text-[15px] sm:leading-[21px] hidden group-hover:block z-50">
                    {item.edition === "Deluxe"
                      ? `${game.title} Deluxe Edition`
                      : game.title}
                  </div>
                </div>
                <div className="flex items-center gap-[8px] justify-center">
                  <button
                    className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] flex items-center justify-center"
                    onClick={() => updateCartQuantity(cartKey, -1)}>
                    <svg
                      width="12"
                      height="2"
                      viewBox="0 0 17 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.5 1.00098H0.5"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                  <div
                    className="relative max-w-[27px]"
                    onClick={() => {
                      setEditingCartKey(cartKey);
                      setNewQuantity(item.quantity);
                    }}>
                    {editingCartKey === cartKey ? (
                      <input
                        type="number"
                        value={newQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                        autoFocus
                        className="max-w-[22px] text-center text-[13px] bg-transparent text-primary-main no-arrows focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleQuantityBlur();
                        }}
                      />
                    ) : (
                      <span className="text-white cursor-pointer max-w-[27px] text-[13px] text-center">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                  <button
                    className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] flex items-center justify-center"
                    onClick={() => updateCartQuantity(cartKey, 1)}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.5 12.001H4.5"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12.5 4.00098V20.001"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-gray-68 font-bold text-[17px] leading-[17px sm:leading-[21px] text-end">
                  {effectivePrice}$
                </span>
              </div>
            );
          })
          .filter((item) => item !== null)}
      </div>
    );
  }, [
    cartQuantities,
    cartGames,
    updateCartQuantity,
    editingCartKey,
    newQuantity,
    scrollBorders,
    scrollContainerRef,
  ]);

  const totalPages = useMemo(
    () => Math.ceil(Object.keys(cartQuantities).length / gamesPerPage),
    [cartQuantities, gamesPerPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePay = () => {
    setIsPayClicked(true);
    setIsTouchedAddress(true);
    setIsTouchedDiscountCode(true);
    setIsTouchedGiftCard(true);
    if (!selectedAdress) {
      adressRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!paymentMethod) {
      paymentMethodRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const newOrder = { ...cartQuantities };
    setOrder(newOrder);
    setCartQuantities({});

    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const newOrderData = {
      total,
      date,
      time,
      paymentMethod,
    };
    setOrderData(newOrderData);

    if (typeof window !== "undefined") {
      localStorage.setItem("order", JSON.stringify(newOrder));
      localStorage.setItem("orderData", JSON.stringify(newOrderData));
    }

    window.location.href = "/cart/payment/success";
  };

  const ArrowDownIcon = (
    <svg
      width="8"
      height="13"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rotate-90`}>
      <path
        d="M1.5 2L8.5 9L1.5 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  const isAddressValid = selectedAdress.trim() !== "" || !isTouchedAddress;

  return (
    <section>
      <div className="flex flex-col xl:flex-row gap-[56px] sm:gap-[17px]">
        <div className="flex-1 flex flex-col gap-[56px] lg:gap-[48px]">
          <div>
            <Heading
              variant="h1"
              className="mb-[16px] sm:mb-[30px]"
              aria-label="Address for Billing">
              Address for Billing
            </Heading>
            <div
              ref={adressRef}
              onClick={() => setIsAddressOpen(!isAddressOpen)}
              className="relative cursor-pointer max-w-[calc(100%-20px)] mx-auto">
              <Input
                type="text"
                placeholder="VAT"
                value={selectedAdress}
                name="address"
                variant="skewed"
                onChange={(e) => {
                  setSelectedAdress(e.target.value);
                  setIsTouchedAddress(true);
                }}
                required
                errorMessage={
                  isTouchedAddress && !selectedAdress.trim()
                    ? "Fill in the field"
                    : ""
                }
                className="mb-[0] cursor-pointer"
                autoComplete="off"
                readOnly
                isTouched={isTouchedAddress}
                isValid={isAddressValid}>
                <div className="absolute skew-x-[20deg] top-[50%] translate-y-[-50%] right-[16px] cursor-pointer">
                  {ArrowDownIcon}
                </div>
              </Input>
              {isAddressOpen && (
                <div className="absolute top-[48px] left-[-10px] z-10 w-full bg-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                  {addresses.map((address, index) => {
                    const vatPercentage = parseFloat(
                      address.match(/(\d+)%/)?.[1] || "0"
                    );
                    const vatAmount = subtotal * (vatPercentage / 100);
                    const displayValue = `${address} +${vatAmount.toFixed(2)}$`;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedAdress(displayValue);
                          setIsTouchedAddress(true);
                          setIsAddressOpen(false);
                        }}
                        className="px-[20px] py-[12px] text-[15px] leading-[20px] cursor-pointer hover:bg-primary-10">
                        {displayValue}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div ref={paymentMethodRef}>
            <PaymentMethod
              onMethodSelect={(method) => setPaymentMethod(method)}
              isPayClicked={isPayClicked}
            />
          </div>
        </div>
        <section className="w-full xl:w-[390px] flex flex-col gap-[12px]">
          <div className="lg:skew-x-[-20deg] lg:py-[6px] lg:px-[18px] lg:flex justify-center items-center lg:bg-3">
            <Heading
              variant="h2"
              className="lg:skew-x-[20deg]"
              aria-label="Total Price">
              Total Price
            </Heading>
          </div>
          <div className="flex flex-col gap-[15px] w-full">
            {displayMode === 1 ? (
              <>
                <div className="flex flex-col w-full lg:min-h-[151px]">
                  {paginatedGames}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col gap-[20px] w-full max-h-[190px]">
                {scrolledGames}
              </div>
            )}
          </div>
          <Input
            placeholder="Discount Code"
            type="text"
            backgroundClass="bg-3 border-[#333333]"
            value={discountCode}
            onChange={(e) => {
              setDiscountCode(e.target.value);
              setIsTouchedDiscountCode(true);
            }}
            onBlur={() => setIsTouchedDiscountCode(true)}
            variant="straight"
            autoComplete="off"
            errorMessage={
              isTouchedDiscountCode && discountCode && !isValidPromoCode
                ? "Invalid code"
                : ""
            }
            isTouched={isTouchedDiscountCode}
            isValid={discountCode === "" || isValidPromoCode}>
            <div className="absolute top-[50%] translate-y-[-50%] right-[18px] cursor-pointer">
              <svg
                width="8"
                height="13"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 2L8.5 9L1.5 16"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </Input>
          <Input
            placeholder="Gift Cards"
            type="text"
            backgroundClass="bg-3 border-[#333333]"
            value={giftCard}
            onChange={(e) => {
              setGiftCard(e.target.value);
              setIsTouchedGiftCard(true);
            }}
            onBlur={() => setIsTouchedGiftCard(true)}
            variant="straight"
            autoComplete="off"
            errorMessage={
              isTouchedGiftCard && giftCard && !isValidGiftCard
                ? "Invalid code"
                : ""
            }
            isTouched={isTouchedGiftCard}
            isValid={giftCard === "" || isValidGiftCard}>
            <div className="absolute top-[50%] translate-y-[-50%] right-[18px] cursor-pointer">
              <svg
                width="8"
                height="13"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.5 2L8.5 9L1.5 16"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </Input>
          <div className="w-full md:px-[9px] md:py-[30px] flex flex-col gap-[16px]">
            <div className="flex flex-col w-full gap-[12px] sm:gap-[20px] pb-[20px] border-b-4 border-[#4C4C4C]">
              <div className="flex w-full justify-between items-center gap-[8px]">
                <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[19px] sm:leading-[21px]">
                  Official price
                </span>
                <span className="text-gray-68 font-bold text-[17px] leading-[19px] sm:text-[15px] sm:leading-[18px]">
                  {subtotal.toFixed(2)}$
                </span>
              </div>
              <div className="flex w-full justify-between items-center gap-[8px]">
                <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[19px] sm:leading-[21px]">
                  VAT ({vatPercentage}%)
                </span>
                <span className="text-gray-68 font-bold text-[17px] leading-[19px] sm:text-[15px] sm:leading-[18px]">
                  {vat.toFixed(2)}$
                </span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex w-full justify-between items-center gap-[8px]">
                  <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[19px] sm:leading-[21px]">
                    Discount
                  </span>
                  <span className="text-gray-68 font-bold text-[17px] leading-[19px] sm:text-[15px] sm:leading-[18px]">
                    -{totalDiscount.toFixed(2)}$
                  </span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex w-full justify-between items-center gap-[8px]">
                  <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[19px] sm:leading-[21px]">
                    Discount Code
                  </span>
                  <span className="text-gray-68 font-bold text-[17px] leading-[19px] sm:text-[15px] sm:leading-[18px]">
                    -{promoDiscount.toFixed(2)}$
                  </span>
                </div>
              )}
              {giftCardDiscount > 0 && (
                <div className="flex w-full justify-between items-center gap-[10px]">
                  <span className="uppercase m-0 text-gray-68 font-usuzi-condensed text-[16px] leading-[16px] sm:text-[19px] sm:leading-[21px]">
                    Gift Card
                  </span>
                  <span className="text-gray-68 font-bold text-[17px] leading-[19px] sm:text-[15px] sm:leading-[18px]">
                    -{giftCardDiscount.toFixed(2)}$
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-full justify-between items-center gap-[10px] sm:mb-[32px] md:mb-[42px]">
              <span className="uppercase m-0 text-white font-usuzi-condensed text-[16px] leading-[16px] sm:text-[21px] sm:leading-[21px]">
                Total
              </span>
              <span className="text-white font-bold text-[20px] leading-[24px] sm:text-[21px] sm:leading-[21px]">
                {total.toFixed(2)}$
              </span>
            </div>
            <div className="fixed bottom-[60px] left-0 sm:static z-[2000] sm:z-10 flex items-center gap-[16px] w-full p-[16px] sm:p-0 border-t-[1px] border-primary-main sm:border-none bg-2 sm:bg-transparent">
              <span className="sm:hidden text-white font-bold font-usuzi-condensed text-[22px] leading-[22px] sm:text-[28px] sm:leading-[28px]">
                {total.toFixed(2)}$
              </span>
              <Button
                variant="primary"
                className="max-w-[calc(100%-20px)] mr-[10px] sm:mx-auto"
                onClick={handlePay}>
                Pay
              </Button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PaymentContent;
