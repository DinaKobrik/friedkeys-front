"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import Heading from "@/components/ui/Heading";
const Pagination = React.lazy(() => import("@/components/ui/Pagination"));
const AccountMenu = React.lazy(
  () => import("@/components/Sections/Account/AccountMenu")
);
const Order = React.lazy(() => import("@/components/Sections/Account/Order"));

interface Game {
  id: number;
  title: string;
  price: number;
  discount?: number;
  discountDate?: string;
}

interface CartItem {
  quantity: number;
  edition: string;
  platform: string;
  region: string;
  addedAt: number;
}

interface Order {
  id: string;
  date: string;
  time: string;
  gameCount: number;
  totalPrice: string;
  paymentMethod: string;
  status: string;
  items: { [key: string]: CartItem };
}

// статичные заказы
const initialMockOrders: Order[] = [
  {
    id: "FK-20250603-1241",
    date: "29/8/2025",
    time: "12:00",
    paymentMethod: "Wallet",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "24_Standard_PC_US": {
        quantity: 6,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: 1759251275239,
      },
      "2_Deluxe_PS5_US": {
        quantity: 2,
        edition: "Deluxe",
        platform: "PS5",
        region: "US",
        addedAt: 1759251275240,
      },
    },
  },
  {
    id: "FK-20250603-1242",
    date: "27/8/2025",
    time: "14:30",
    paymentMethod: "Paypal",
    status: "Pending",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "52_Standard_Xbox_US": {
        quantity: 1,
        edition: "Standard",
        platform: "Xbox",
        region: "US",
        addedAt: 1759164875239,
      },
    },
  },
  {
    id: "FK-20250603-1243",
    date: "26/8/2025",
    time: "09:15",
    paymentMethod: "Crypto",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "67_Deluxe_PC_US": {
        quantity: 3,
        edition: "Deluxe",
        platform: "PC",
        region: "US",
        addedAt: 1759078475239,
      },
      "5_Standard_PS5_US": {
        quantity: 1,
        edition: "Standard",
        platform: "PS5",
        region: "US",
        addedAt: 1759078475240,
      },
    },
  },
  {
    id: "FK-20250603-1244",
    date: "25/8/2025",
    time: "16:45",
    paymentMethod: "Card",
    status: "Failed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "68_Standard_Xbox_US": {
        quantity: 2,
        edition: "Standard",
        platform: "Xbox",
        region: "US",
        addedAt: 1758992075239,
      },
    },
  },
  {
    id: "FK-20250603-1245",
    date: "24/8/2025",
    time: "11:20",
    paymentMethod: "Wallet",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "7_Deluxe_PS5_US": {
        quantity: 1,
        edition: "Deluxe",
        platform: "PS5",
        region: "US",
        addedAt: 1758905675239,
      },
      "8_Standard_PC_US": {
        quantity: 1,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: 1758905675240,
      },
    },
  },
  {
    id: "FK-20250603-1246",
    date: "23/8/2025",
    time: "13:10",
    paymentMethod: "Paypal",
    status: "Pending",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "9_Standard_Xbox_US": {
        quantity: 1,
        edition: "Standard",
        platform: "Xbox",
        region: "US",
        addedAt: 1758819275239,
      },
      "10_Deluxe_PC_US": {
        quantity: 2,
        edition: "Deluxe",
        platform: "PC",
        region: "US",
        addedAt: 1758819275240,
      },
    },
  },
  {
    id: "FK-20250603-1247",
    date: "22/8/2025",
    time: "10:00",
    paymentMethod: "Crypto",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "11_Standard_PS5_US": {
        quantity: 1,
        edition: "Standard",
        platform: "PS5",
        region: "US",
        addedAt: 1758732875239,
      },
    },
  },
  {
    id: "FK-20250603-1248",
    date: "21/8/2025",
    time: "15:30",
    paymentMethod: "Card",
    status: "Cancelled",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "12_Deluxe_Xbox_US": {
        quantity: 1,
        edition: "Deluxe",
        platform: "Xbox",
        region: "US",
        addedAt: 1758646475239,
      },
      "13_Standard_PC_US": {
        quantity: 2,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: 1758646475240,
      },
    },
  },
  {
    id: "FK-20250603-1249",
    date: "20/8/2025",
    time: "08:50",
    paymentMethod: "Wallet",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "14_Standard_PS5_US": {
        quantity: 1,
        edition: "Standard",
        platform: "PS5",
        region: "US",
        addedAt: 1758560075239,
      },
    },
  },
  {
    id: "FK-20250603-1250",
    date: "19/8/2025",
    time: "17:00",
    paymentMethod: "Paypal",
    status: "Pending",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "15_Deluxe_PC_US": {
        quantity: 1,
        edition: "Deluxe",
        platform: "PC",
        region: "US",
        addedAt: 1758473675239,
      },
      "16_Standard_Xbox_US": {
        quantity: 1,
        edition: "Standard",
        platform: "Xbox",
        region: "US",
        addedAt: 1758473675240,
      },
    },
  },
  {
    id: "FK-20250603-1251",
    date: "18/8/2025",
    time: "12:25",
    paymentMethod: "Crypto",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "17_Standard_PS5_US": {
        quantity: 2,
        edition: "Standard",
        platform: "PS5",
        region: "US",
        addedAt: 1758387275239,
      },
      "18_Deluxe_Xbox_US": {
        quantity: 1,
        edition: "Deluxe",
        platform: "Xbox",
        region: "US",
        addedAt: 1758387275240,
      },
    },
  },
  {
    id: "FK-20250603-1252",
    date: "17/8/2025",
    time: "14:15",
    paymentMethod: "Card",
    status: "Failed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "19_Standard_PC_US": {
        quantity: 1,
        edition: "Standard",
        platform: "PC",
        region: "US",
        addedAt: 1758300875239,
      },
    },
  },
  {
    id: "FK-20250603-1253",
    date: "16/8/2025",
    time: "09:45",
    paymentMethod: "Wallet",
    status: "Completed",
    gameCount: 0,
    totalPrice: "0.00",
    items: {
      "20_Deluxe_PS5_US": {
        quantity: 1,
        edition: "Deluxe",
        platform: "PS5",
        region: "US",
        addedAt: 1758214475239,
      },
      "21_Standard_Xbox_US": {
        quantity: 1,
        edition: "Standard",
        platform: "Xbox",
        region: "US",
        addedAt: 1758214475240,
      },
    },
  },
];

export default React.memo(function OrdersPage() {
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mockOrders, setMockOrders] = useState<Order[]>(initialMockOrders);
  const [cartGames, setCartGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGameById = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/games?type=game&id=${id}`);
      if (!response.ok) {
        console.error(
          `API error: Failed to fetch game with id ${id}, status: ${response.status}`
        );
        throw new Error(`Failed to fetch game with id ${id}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const foundGame = data.find((g) => g.id === id);
        if (!foundGame) {
          console.warn(`Game with id ${id} not found in API response`);
          return null;
        }
        return foundGame;
      } else if (data.id) {
        return data;
      }
      console.warn(`Invalid API response format for id ${id}`);
      return null;
    } catch (error) {
      console.error(`Failed to fetch game with id ${id}:`, error);
      return null;
    }
  }, []);

  const calculateTotal = useCallback(
    (orderItems: { [key: string]: CartItem }) => {
      let subtotal = 0;

      Object.entries(orderItems).forEach(([cartKey, item]) => {
        const gameId = Number(cartKey.split("_")[0]);
        const game = cartGames.find((g) => g.id === gameId);
        if (game) {
          const quantity = item.quantity;
          const originalPrice = game.price * quantity;
          subtotal += originalPrice;

          const isDiscountExpired =
            game.discountDate &&
            new Date(game.discountDate).getTime() < new Date().getTime();

          if (game.discount && !isDiscountExpired) {
            const discountAmount =
              ((game.price * (game.discount || 0)) / 100) * quantity;
            subtotal -= discountAmount;
          }
        } else {
          console.warn(`Game with id ${gameId} not found in cartGames`);
        }
      });

      // Условно VAR 10%
      subtotal *= 1.1;

      const result = subtotal.toFixed(2);
      return result;
    },
    [cartGames]
  );

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const gameIds = Array.from(
        new Set(
          initialMockOrders.flatMap((order) =>
            Object.keys(order.items).map((key) => Number(key.split("_")[0]))
          )
        )
      );

      const gamesPromises = gameIds.map((id) => fetchGameById(id));
      const games = (await Promise.all(gamesPromises)).filter(
        (game) => game !== null
      ) as Game[];
      setCartGames(games);
      setLoading(false);
    };

    loadGames();
  }, [fetchGameById]);

  useEffect(() => {
    if (!loading && cartGames.length > 0) {
      const updatedOrders = initialMockOrders.map((order) => ({
        ...order,
        gameCount: Object.values(order.items).reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalPrice: calculateTotal(order.items),
      }));
      setMockOrders(updatedOrders);
    } else if (!loading && cartGames.length === 0) {
      console.warn("No games loaded, setting totalPrice to 0.00");
      const updatedOrders = initialMockOrders.map((order) => ({
        ...order,
        gameCount: Object.values(order.items).reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalPrice: "0.00",
      }));
      setMockOrders(updatedOrders);
    }
  }, [cartGames, calculateTotal, loading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setOrdersPerPage(window.innerWidth < 991 ? 5 : 10);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * ordersPerPage;
    const endIdx = currentPage * ordersPerPage;
    return mockOrders.slice(startIdx, endIdx).map((order, index) => (
      <Suspense key={order.id} fallback={<div>Loading order...</div>}>
        <Order
          id={order.id}
          date={order.date}
          time={order.time}
          gameCount={order.gameCount}
          totalPrice={order.totalPrice}
          paymentMethod={order.paymentMethod}
          status={order.status}
          index={index}
          items={order.items}
        />
      </Suspense>
    ));
  }, [mockOrders, currentPage, ordersPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(mockOrders.length / ordersPerPage),
    [mockOrders.length, ordersPerPage]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".order-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (loading) {
    return (
      <Heading variant="h3" className="text-center py-10" aria-live="polite">
        Loading...
      </Heading>
    );
  }

  return (
    <main className="min-h-screen mt-[24px] sm:mt-[80px]">
      <Suspense fallback={<div>Loading menu...</div>}>
        <AccountMenu activeLink="/auth/account/orders" />
      </Suspense>
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-[8px] mt-[40px] sm:mt-[80px] mb-[24px] lg:mb-[48px]">
          <Heading variant="h1">orders</Heading>
          <div className="game-count text-[16px] sm:text-[32px] sm:font-usuzi-condensed text-white sm:uppercase">
            {mockOrders.length} orders
          </div>
        </div>
        <div className="orders-grid hidden xl:grid grid-cols-6 justify-items-center items-center skew-x-[-20deg] bg-3 py-[12px] px-[18px] max-w-[calc(100%-20px)] mx-auto mb-[8px]">
          <Heading variant="h3" className="skew-x-[20deg]">
            ID
          </Heading>
          <Heading variant="h3" className="skew-x-[20deg]">
            date / time
          </Heading>
          <Heading variant="h3" className="skew-x-[20deg]">
            count
          </Heading>
          <Heading variant="h3" className="skew-x-[20deg] text-center">
            total price
          </Heading>
          <Heading variant="h3" className="skew-x-[20deg] text-center">
            Payment method
          </Heading>
          <Heading variant="h3" className="skew-x-[20deg]">
            status
          </Heading>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-[16px] xl:gap-0 mb-[24px] sm:mb-[56px] xl:bg-2 xl:py-[24px]">
          {paginatedOrders}
        </div>
        {totalPages > 1 && (
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </Suspense>
        )}
      </section>
    </main>
  );
});
