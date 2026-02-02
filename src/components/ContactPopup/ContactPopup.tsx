import React, { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[#C0EBA6] px-4 py-2 bg-[#FFFBE6] " +
  "outline-none transition " +
  "hover:border-[#347928] " +
  "focus:border-[#347928] focus:ring-2 focus:ring-[#347928]/30";

const ContactPopup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"details" | "whatsapp">("details");
  const [propertyType, setPropertyType] = useState("");

  const openWhatsApp = () => {
    const phone = "919999999999";
    const message = encodeURIComponent("Hi, I’m interested in your property.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex bg-[#C0EBA6]/40 rounded-full p-1">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "details"
              ? "bg-[#FFFBE6] text-[#347928] shadow"
              : "text-[#347928]"
          }`}
        >
          Share Details
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "whatsapp"
              ? "bg-[#FFFBE6] text-[#347928] shadow"
              : "text-[#347928]"
          }`}
        >
          WhatsApp
        </button>
      </div>

      {activeTab === "details" && (
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className={`${inputClass} text-gray-800 placeholder:text-gray-400`}
              placeholder="you@example.com"
            />

            <input
              className={`${inputClass} text-gray-800 placeholder:text-gray-400`}
              placeholder="Your name *"
            />

            <input
              className={`${inputClass} text-gray-800 placeholder:text-gray-400`}
              placeholder="Phone *"
            />

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${inputClass} ${
                propertyType ? "text-gray-800" : "text-gray-400"
              }`}
            >
              <option value="" disabled>
                Select property type
              </option>
              <option>Farmhouse</option>
              <option>Agriculture Land</option>
              <option>Resort Property</option>
            </select>

            <input
              className={`${inputClass} md:col-span-2 text-gray-800 placeholder:text-gray-400`}
              placeholder="Budget in numbers"
            />
          </div>

          <textarea
            rows={3}
            className={`${inputClass} text-gray-800 placeholder:text-gray-400`}
            placeholder="Tell us more about what you need"
          />

          <p className="text-sm text-[#347928]">
            Name and phone are required.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="reset"
              className="border border-[#347928] text-[#347928] px-4 py-2 rounded-full hover:bg-[#C0EBA6]/40 transition"
            >
              Reset
            </button>

            <button
              type="submit"
              className="bg-[#347928] text-white px-5 py-2 rounded-full hover:bg-[#2d6522] transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {activeTab === "whatsapp" && (
        <div className="space-y-4">
          <div className="border border-[#C0EBA6] bg-[#C0EBA6]/30 rounded-xl p-4 text-[#347928] text-sm space-y-2">
            <p className="font-medium">
              Prefer a quick chat? Ping us on WhatsApp.
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>Instant conversation with a specialist</li>
              <li>Share images / location pins easily</li>
              <li>Service hours: 9am – 7pm IST</li>
              <li>We usually reply within a few minutes</li>
            </ul>
          </div>

          <button
            onClick={openWhatsApp}
            className="bg-[#347928] text-white px-5 py-2 rounded-full hover:bg-[#2d6522] transition w-full sm:w-auto"
          >
            Open WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactPopup;
