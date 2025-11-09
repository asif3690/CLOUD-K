// src/Pages/Dashboard.jsx
import React, { useMemo } from "react";
import useFetch from "../Hooks/useFetch.jsx";
import { API_ENDPOINTS } from "../utils/constants";
import Loader from "../Components/Loader.jsx";
import {
  UtensilsCrossed,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const { data: menu, loading: menuLoading } = useFetch(API_ENDPOINTS.menu);
  const { data: orders, loading: ordersLoading } = useFetch(API_ENDPOINTS.orders);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!menu || !orders) return null;

    const totalMenuItems = menu.length;
    const availableItems = menu.filter((item) => item.AVAILABLE).length;
    const totalOrders = orders.length;
    
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.TOTAL_AMOUNT || 0),
      0
    );

    const pendingOrders = orders.filter(
      (order) => order.STATUS?.toLowerCase() === "pending"
    ).length;

    const completedOrders = orders.filter(
      (order) => order.STATUS?.toLowerCase() === "completed"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.STATUS?.toLowerCase() === "cancelled"
    ).length;

    // Recent orders (last 5)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.ORDER_DATE) - new Date(a.ORDER_DATE))
      .slice(0, 5);

    return {
      totalMenuItems,
      availableItems,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
    };
  }, [menu, orders]);

  if (menuLoading || ordersLoading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
          Unable to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Menu Items",
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Available Items",
      value: stats.availableItems,
      icon: TrendingUp,
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const orderStatusCards = [
    {
      title: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      title: "Completed",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      title: "Cancelled",
      value: stats.cancelledOrders,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  ];

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed") {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else if (statusLower === "cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening in your kitchen today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgLight} p-3 rounded-lg`}>
                  <Icon className={`${card.textColor}`} size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Order Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-600" />
          Order Status Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orderStatusCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`${card.bg} ${card.border} border rounded-lg p-4 flex items-center gap-4`}
              >
                <div className={`${card.color}`}>
                  <Icon size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart size={20} className="text-blue-600" />
          Recent Orders
        </h2>
        {stats.recentOrders.length > 0 ? (
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.ORDER_ID}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Order #{order.ORDER_ID}
                  </p>
                  <p className="text-sm text-gray-600">{order.USERNAME}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.ORDER_DATE).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-gray-800">
                    ${parseFloat(order.TOTAL_AMOUNT).toFixed(2)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                      order.STATUS
                    )}`}
                  >
                    {order.STATUS}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
            <p>No orders yet</p>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 opacity-90">
            Average Order Value
          </h3>
          <p className="text-4xl font-bold">
            $
            {stats.totalOrders > 0
              ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
              : "0.00"}
          </p>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 opacity-90">
            Completion Rate
          </h3>
          <p className="text-4xl font-bold">
            {stats.totalOrders > 0
              ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
              : "0"}
            %
          </p>
        </div>
      </div>
    </div>
  );
}