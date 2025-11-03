"use client";

import React, { useState, useRef, useEffect } from "react";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Image from "next/image";

// SVG для стрелочки
const ArrowIcon = () => (
  <svg
    width="10"
    height="18"
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform="rotate(90)">
    <path
      d="M1.5 2L8.5 9L1.5 16"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
);

// SVG для корзины
const TrashIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[22px] h-[22px] md:w-[32px] md:h-[32px]">
    <path
      d="M5.49219 8.60156H26.5071L24.6173 28.3337H7.38205L5.49219 8.60156Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    <path
      d="M21.9678 7.99641L20.5428 3.66663H11.4562L10.0312 7.99641"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
    <path
      d="M16 15.1517L16 21.7822"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
);

// Статичные данные для тем и заказов
const topics = [
  "Technical Issue",
  "Billing",
  "Account Support",
  "Game Bug",
  "Other",
];
const orders = ["Order #12345", "Order #12346", "Order #12347", "Order #12348"];

const SupportPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [message, setMessage] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);
  const [isTouchedTopic, setIsTouchedTopic] = useState(false);
  const [isTouchedOrder, setIsTouchedOrder] = useState(false);
  const [isValidTopic, setIsValidTopic] = useState(true);
  const [isValidOrder, setIsValidOrder] = useState(true);
  const [isTouchedMessage, setIsTouchedMessage] = useState(false);
  const [isValidMessage, setIsValidMessage] = useState(true);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setIsTopicOpen(false);
    setIsTouchedTopic(true);
    setIsValidTopic(true);
  };

  const handleOrderSelect = (order: string) => {
    setSelectedOrder(order);
    setIsOrderOpen(false);
    setIsTouchedOrder(true);
    setIsValidOrder(true);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (isTouchedMessage && !isValidMessage && newMessage.trim()) {
      setIsValidMessage(true);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(filePromises).then((results) => {
        setScreenshots((prev) => [...prev, ...results]);
      });
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouchedTopic(true);
    setIsTouchedOrder(true);
    setIsTouchedMessage(true);
    setIsValidTopic(true);
    setIsValidOrder(true);
    setIsValidMessage(true);
    if (!selectedTopic.trim()) {
      setIsValidTopic(false);
      return;
    }
    if (!selectedOrder.trim()) {
      setIsValidOrder(false);
      return;
    }
    if (!message.trim()) {
      setIsValidMessage(false);
      return;
    }
    const supportRequest = {
      topic: selectedTopic,
      order: selectedOrder,
      message,
      screenshots,
      timestamp: new Date().toISOString(),
    };
    const existingRequests = JSON.parse(
      localStorage.getItem("supportRequests") || "[]"
    );
    existingRequests.push(supportRequest);
    localStorage.setItem("supportRequests", JSON.stringify(existingRequests));
    setSelectedTopic("");
    setSelectedOrder("");
    setMessage("");
    setScreenshots([]);
    setShowModal(true);
    setFadeOut(false);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowModal(false);
      }, 300);
    }, 2000);
  };

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);
    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicRef.current &&
        !topicRef.current.contains(event.target as Node)
      ) {
        setIsTopicOpen(false);
      }
      if (
        orderRef.current &&
        !orderRef.current.contains(event.target as Node)
      ) {
        setIsOrderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="mt-[24px] sm:mt-[60px] xl:mt-[136px]">
      <section>
        <Heading variant="h3" className="mb-[24px] sm:mb-[30px]">
          Home / support
        </Heading>
        <Heading variant="h1" className="mb-[24px] sm:mb-[60px]">
          FriedKeys Support Center
        </Heading>
        <div className="flex flex-col gap-[16px] max-w-[792px] mx-auto w-full">
          <Text>
            {`Let us know what's going on — we'll get back to you as soon as
            possible`}
          </Text>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-[16px]">
            <div
              className="relative cursor-pointer"
              ref={topicRef}
              onClick={() => setIsTopicOpen(!isTopicOpen)}>
              <Input
                label="Choose a topic"
                type="text"
                value={selectedTopic}
                name="topic"
                required
                onChange={() => {}}
                variant="straight"
                errorMessage={
                  !isValidTopic && isTouchedTopic ? "Fill in the field" : ""
                }
                className="mb-[0] cursor-pointer"
                readOnly
                isTouched={isTouchedTopic}
                isValid={isValidTopic}>
                <div className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer">
                  <ArrowIcon />
                </div>
              </Input>
              {isTopicOpen && (
                <div
                  id="topicDropdown"
                  className="absolute top-[64px] z-50 w-full bg-2 mt-[8px] max-h-[200px] overflow-y-auto custom-scrollbar">
                  {topics.map((topic) => (
                    <div
                      key={topic}
                      className="px-[20px] py-[12px] cursor-pointer hover:bg-primary-10"
                      onClick={() => handleTopicSelect(topic)}>
                      {topic}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative cursor-pointer"
              ref={orderRef}
              onClick={() => setIsOrderOpen(!isOrderOpen)}>
              <Input
                label="order number"
                type="text"
                value={selectedOrder}
                name="order"
                placeholder="—"
                required
                onChange={() => {}}
                variant="straight"
                className="mb-[0] cursor-pointer"
                readOnly
                isTouched={isTouchedOrder}
                isValid={isValidOrder}
                errorMessage={
                  !isValidOrder && isTouchedOrder ? "Fill in the field" : ""
                }>
                <div className="absolute top-[50%] translate-y-[-50%] right-[16px] cursor-pointer">
                  <ArrowIcon />
                </div>
              </Input>
              {isOrderOpen && (
                <div
                  id="orderDropdown"
                  className="absolute top-[64px] z-50 w-full bg-2 mt-[8px] max-h-[200px] overflow-y-auto custom-scrollbar">
                  {orders.map((order) => (
                    <div
                      key={order}
                      className="px-[20px] py-[12px] cursor-pointer hover:bg-primary-10"
                      onClick={() => handleOrderSelect(order)}>
                      {order}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Textarea
                label="Your Message"
                value={message}
                name="message"
                required
                onChange={handleMessageChange}
                placeholder="Describe your issue in detail"
                className="h-[104px] sm:h-[120px]"
                variant="straight"
                isTouched={isTouchedMessage}
                isValid={isValidMessage}
                errorMessage={
                  !isValidMessage && isTouchedMessage ? "Fill in the field" : ""
                }
              />
            </div>

            <div className="flex flex-col gap-[8px] w-full mb-[32px] py-[16px]">
              <Heading variant="h3">{`Upload a Screenshot (.png or .jpg)`}</Heading>
              <div className="grid grid-cols-1 md:grid-cols-5 md:h-[136px] py-[8px] justify-center items-center gap-[24px] md:gap-[50px]">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="md:col-span-2 ml-[10px] max-w-[calc(100%-20px)] md:max-w-[100%]">
                  Add Screenshot
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleScreenshotUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                  name="screenshots"
                />
                <div className="flex overflow-x-auto custom-scrollbar-h md:col-span-3 gap-[12px] md:gap-[18px]">
                  {screenshots.map((src, index) => (
                    <div key={index} className="relative flex-shrink-0 group">
                      <Image
                        src={src}
                        alt="Screenshot"
                        width={120}
                        height={120}
                        className="object-cover rounded h-[82px] w-[82px] md:h-[120px] md:w-[120px]"
                      />
                      <div
                        className={`absolute cursor-pointer top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[44px] h-[44px] md:w-[64px] md:h-[64px] flex justify-center items-center rounded-full trash-icon ${
                          isTouchDevice ? "" : "hidden group-hover:flex"
                        }`}
                        onClick={() => handleRemoveScreenshot(index)}>
                        <TrashIcon />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Text>
                Attach a photo or screenshot to help us understand your issue
                faster
              </Text>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="max-w-[calc(100%-20px)] sm:max-w-[390px] mb-[8px]">
              Submit Request
            </Button>
            <Text className="mb-[12px]">
              Our support team typically replies within a few hours. Thanks for
              your patience!
            </Text>
          </form>
        </div>
      </section>
      {showModal && (
        <div
          className={`fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-500 ease-in-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite">
          <div
            className={`absolute w-full h-full bg-[#0000003A] backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}></div>
          <div
            className={`relative border-[1px] overflow-hidden border-primary-main bg-2 px-[20px] py-[40px] max-w-[320px] flex justify-center items-center text-center transition-all duration-300 ease-in-out ${
              fadeOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}>
            <Heading variant="h3">
              Support request submitted successfully
            </Heading>
            <div className="h-[7px] w-[75%] sm:w-[50%] absolute bottom-0 left-[50%] bg-primary-main translate-x-[-50%] blur-[30px] z-0"></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SupportPage;
