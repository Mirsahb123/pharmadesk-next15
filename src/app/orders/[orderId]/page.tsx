"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    // Get order from sessionStorage (demo)
    const lastOrder = sessionStorage.getItem("lastOrder");
    if (lastOrder) {
      const parsedOrder = JSON.parse(lastOrder);
      if (parsedOrder.orderNumber === params.orderId) {
        setOrder(parsedOrder);
      }
    }
  }, [params.orderId]);

  if (!order) {
    return (
      <div className="min-h-screen pt-20 bg-[#FAF8F0] flex items-center justify-center">
        <div className="text-center">
          <p className="font-[family-name:var(--font-cinzel)] text-xl text-[#7B1818] mb-4">
            Order not found
          </p>
          <Link href="/" className="text-[#D4AF37] hover:text-[#7B1818] transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Mock status timeline (for demo, this would come from backend)
  const statusTimeline = [
    { status: "pending", label: "Order Placed", completed: true, time: new Date(order.createdAt) },
    { status: "preparing", label: "Preparing", completed: false, time: null },
    { status: "ready", label: "Ready for Delivery", completed: false, time: null },
    { status: "on_the_way", label: "On the Way", completed: false, time: null },
    { status: "delivered", label: "Delivered", completed: false, time: null },
  ];

  const currentStatus = 0; // For demo, always show as "pending"

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FAF8F0]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl font-bold text-[#7B1818] mb-2">
            Order Placed Successfully!
          </h1>
          <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#7B1818]/60">
            Order #{order.orderNumber}
          </p>
          <p className="font-[family-name:var(--font-cormorant)] text-lg text-[#D4AF37] mt-2">
            Estimated Delivery: 30-45 minutes
          </p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-6">
            Order Status
          </h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#7B1818]/20" />

            <div className="space-y-6">
              {statusTimeline.map((step, index) => (
                <div key={step.status} className="relative flex items-start gap-4">
                  {/* Status Dot */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? "bg-[#7B1818] text-[#FAF8F0]"
                        : index === currentStatus
                        ? "bg-[#D4AF37] text-[#7B1818] animate-pulse"
                        : "bg-[#7B1818]/10 text-[#7B1818]/40"
                    }`}
                  >
                    {step.completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : index === currentStatus ? (
                      <div className="w-3 h-3 bg-[#7B1818] rounded-full" />
                    ) : (
                      <div className="w-3 h-3 bg-[#7B1818]/20 rounded-full" />
                    )}
                  </div>

                  {/* Status Info */}
                  <div className="flex-1 pt-2">
                    <p
                      className={`font-[family-name:var(--font-cinzel)] text-lg font-semibold ${
                        step.completed || index === currentStatus ? "text-[#7B1818]" : "text-[#7B1818]/40"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                        {formatTime(step.time)}
                      </p>
                    )}
                    {index === currentStatus && !step.completed && (
                      <p className="text-sm text-[#D4AF37] font-[family-name:var(--font-cormorant)] mt-1">
                        Current Status
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-4">
            Order Details
          </h2>

          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-[#7B1818]/10 last:border-0">
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                  {item.menuItem.image ? (
                    <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#7B1818]/10 flex items-center justify-center">
                      <span className="text-[#D4AF37] text-2xl">&#9830;</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-cinzel)] text-lg font-semibold text-[#7B1818]">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                    {item.selectedWeight.weight} × {item.quantity}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-sm text-[#D4AF37] font-[family-name:var(--font-cormorant)] mt-1">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#7B1818]">
                    Rs. {item.selectedWeight.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-[#7B1818]/20 mt-4 pt-4 space-y-2">
            <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-lg">
              <span className="text-[#7B1818]/60">Subtotal:</span>
              <span className="text-[#7B1818]">Rs. {order.subtotal}</span>
            </div>
            <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-lg">
              <span className="text-[#7B1818]/60">Delivery:</span>
              <span className="text-[#7B1818]">Rs. {order.deliveryCharges}</span>
            </div>
            <div className="border-t border-[#7B1818]/20 pt-2">
              <div className="flex justify-between font-[family-name:var(--font-cinzel)] text-2xl font-bold">
                <span className="text-[#7B1818]">Total:</span>
                <span className="text-[#D4AF37]">Rs. {order.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-4 pt-4 border-t border-[#7B1818]/20">
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-[#7B1818]/60">
              Payment Method:{" "}
              <span className="text-[#7B1818] font-semibold capitalize">{order.paymentMethod}</span>
            </p>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-4">
            Delivery Information
          </h2>

          <div className="space-y-2">
            <p className="font-[family-name:var(--font-cormorant)] text-lg">
              <span className="text-[#7B1818]/60">Name:</span>{" "}
              <span className="text-[#7B1818] font-semibold">{order.name}</span>
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-lg">
              <span className="text-[#7B1818]/60">Phone:</span>{" "}
              <span className="text-[#7B1818] font-semibold">{order.phone}</span>
            </p>
            {order.email && (
              <p className="font-[family-name:var(--font-cormorant)] text-lg">
                <span className="text-[#7B1818]/60">Email:</span>{" "}
                <span className="text-[#7B1818] font-semibold">{order.email}</span>
              </p>
            )}
            <p className="font-[family-name:var(--font-cormorant)] text-lg">
              <span className="text-[#7B1818]/60">Address:</span>{" "}
              <span className="text-[#7B1818] font-semibold">{order.address}</span>
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-lg">
              <span className="text-[#7B1818]/60">Area:</span>{" "}
              <span className="text-[#7B1818] font-semibold">{order.area}</span>
            </p>
            {order.locationLink && (
              <a
                href={order.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#7B1818] transition-colors mt-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                View on Map
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-[#7B1818] hover:bg-[#5A1010] text-[#FAF8F0] text-center py-4 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/#menu"
            className="flex-1 border-2 border-[#7B1818] text-[#7B1818] hover:bg-[#7B1818]/5 text-center py-4 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors"
          >
            Order Again
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-[#7B1818]/60 font-[family-name:var(--font-cormorant)] text-lg mb-2">
            Need help with your order?
          </p>
          <a
            href={`https://wa.me/923001234567?text=Hi, I need help with order ${order.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#128C7E] font-[family-name:var(--font-cinzel)] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
